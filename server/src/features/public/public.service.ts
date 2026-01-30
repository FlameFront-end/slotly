import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Between } from 'typeorm';
import { OwnerProfile } from '../owner/entities/owner-profile.entity';
import {
  Schedule,
  ScheduleDay,
  TimeBlock,
} from '../schedule/entities/schedule.entity';
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
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);

    const end = endDate
      ? new Date(endDate)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 дней
    end.setHours(23, 59, 59, 999);

    if (start > end) {
      throw new BadRequestException('Неверный формат даты');
    }

    // Получаем все активные бронирования в диапазоне
    const bookings = await this.bookingRepository.find({
      where: {
        ownerId: profile.id,
        date: Between(
          start.toISOString().split('T')[0],
          end.toISOString().split('T')[0],
        ) as any,
        status: Not(BookingStatus.CANCELLED),
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

    // Генерируем слоты для каждого дня в диапазоне
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      const activeDay = schedule.days.find(
        (day) => day.dayOfWeek === dayOfWeek && day.isActive,
      );

      if (activeDay) {
        const dateStr = currentDate.toISOString().split('T')[0];

        for (const timeBlock of activeDay.timeBlocks) {
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

      currentDate.setDate(currentDate.getDate() + 1);
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
}
