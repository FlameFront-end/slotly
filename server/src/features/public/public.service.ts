import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, Between } from 'typeorm';
import { OwnerProfile } from '../owner/entities/owner-profile.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(OwnerProfile)
    private ownerProfileRepository: Repository<OwnerProfile>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async getOwnerProfile(publicId: string): Promise<OwnerProfile> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { publicId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Профиль не найден');
    }

    return profile;
  }

  async getBookingForClient(bookingId: string): Promise<{
    id: string;
    date: string;
    time: string;
    status: string;
    clientName: string;
    clientContact: string;
    owner: {
      publicId: string;
      name: string;
      description: string | null;
      address: string | null;
      mapLink: string | null;
      website: string | null;
    };
  }> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['ownerProfile'],
    });

    if (!booking) {
      throw new NotFoundException('Запись не найдена');
    }

    const owner = booking.ownerProfile;
    return {
      id: booking.id,
      date: booking.date,
      time: booking.time,
      status: booking.status,
      clientName: booking.clientName,
      clientContact: booking.clientContact,
      owner: {
        publicId: owner.publicId,
        name: owner.name,
        description: owner.description ?? null,
        address: owner.address ?? null,
        mapLink: owner.mapLink ?? null,
        website: owner.website ?? null,
      },
    };
  }

  async getAvailableSlots(
    ownerPublicId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<Array<{ date: string; time: string; slotDuration?: number }>> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { publicId: ownerPublicId },
    });

    if (!profile) {
      throw new NotFoundException('Владелец не найден');
    }

    const schedule = await this.scheduleRepository.findOne({
      where: { ownerId: profile.id },
    });

    if (!schedule || !schedule.days || schedule.days.length === 0) {
      return [];
    }

    // Определяем диапазон дат
    const start = startDate
      ? this.parseDateOnly(startDate)
      : this.getTodayUtc();
    const monthsRange = this.normalizeMonthsRange(schedule.bookingRangeMonths);
    const end = endDate
      ? this.parseDateOnly(endDate)
      : this.addMonthsUtc(this.getTodayUtc(), monthsRange);

    if (start > end) {
      throw new BadRequestException('Неверный формат даты');
    }

    // Получаем все активные бронирования в диапазоне
    const bookings = await this.bookingRepository.find({
      where: {
        ownerId: profile.id,
        date: Between(
          this.formatDateOnly(start),
          this.formatDateOnly(end),
        ) as any,
        status: Not(In([BookingStatus.CANCELLED, BookingStatus.REJECTED])),
      },
    });

    const bookedSlots = new Set<string>();
    bookings.forEach((booking) => {
      bookedSlots.add(`${booking.date}_${booking.time}`);
    });

    const availableSlots: Array<{
      date: string;
      time: string;
      slotDuration?: number;
    }> = [];

    const exceptions = Array.isArray(schedule.exceptions)
      ? (schedule.exceptions as Array<{
          date: string;
          isAvailable: boolean;
          startTime?: string;
          endTime?: string;
        }>)
      : [];
    const exceptionsMap = new Map(
      exceptions.map((exception) => [exception.date, exception]),
    );

    // Генерируем слоты для каждого дня в диапазоне
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getUTCDay();
      const activeDay = schedule.days.find(
        (day) => day.dayOfWeek === dayOfWeek && day.isActive,
      );

      const dateStr = this.formatDateOnly(currentDate);
      const exception = exceptionsMap.get(dateStr);
      const slotDuration =
        activeDay?.timeBlocks?.[0]?.slotDuration ??
        schedule.days?.[0]?.timeBlocks?.[0]?.slotDuration ??
        60;

      // Если есть исключение для этой даты, используем его время
      const timeBlocks = exception
        ? exception.startTime && exception.endTime
          ? [
              {
                startTime: exception.startTime,
                endTime: exception.endTime,
                slotDuration,
              },
            ]
          : activeDay?.timeBlocks || [
              {
                startTime: '09:00',
                endTime: '18:00',
                slotDuration,
              },
            ]
        : activeDay?.timeBlocks;

      if (timeBlocks && timeBlocks.length > 0) {
        for (const timeBlock of timeBlocks) {
          const slots = this.generateTimeSlots(
            timeBlock.startTime,
            timeBlock.endTime,
            timeBlock.slotDuration,
          );

          for (const slotTime of slots) {
            const slotKey = `${dateStr}_${slotTime}`;
            if (!bookedSlots.has(slotKey)) {
              availableSlots.push({
                date: dateStr,
                time: slotTime,
                slotDuration: timeBlock.slotDuration,
              });
            }
          }
        }
      }

      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return availableSlots;
  }

  private generateTimeSlots(
    startTime: string,
    endTime: string,
    slotDuration: number,
  ): string[] {
    const slots: string[] = [];
    const startMinutes = this.parseTime(startTime);
    const endMinutes = this.parseTime(endTime);

    let currentMinutes = startMinutes;
    while (currentMinutes + slotDuration <= endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      slots.push(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      );
      currentMinutes += slotDuration;
    }

    return slots;
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private formatDateOnly(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseDateOnly(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  private getTodayUtc(): Date {
    const now = new Date();
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
  }

  private addDaysUtc(date: Date, days: number): Date {
    const next = new Date(date);
    next.setUTCDate(next.getUTCDate() + days);
    return next;
  }

  private addMonthsUtc(date: Date, months: number): Date {
    const next = new Date(date);
    next.setUTCMonth(next.getUTCMonth() + months);
    return next;
  }

  private normalizeMonthsRange(months?: number): number {
    if (!months || !Number.isFinite(months)) return 2;
    return Math.min(24, Math.max(1, months));
  }
}
