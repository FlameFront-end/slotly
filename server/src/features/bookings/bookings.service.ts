import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, IsNull } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { OwnerProfile } from '../owner/entities/owner-profile.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(OwnerProfile)
    private ownerProfileRepository: Repository<OwnerProfile>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) { }

  async findAll(
    ownerId: string,
    filters?: {
      status?: BookingStatus;
      dateFrom?: string;
      dateTo?: string;
    },
  ): Promise<Booking[]> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { userId: ownerId },
    });

    if (!profile) {
      throw new NotFoundException('Профиль владельца не найден');
    }

    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.ownerId = :ownerId', { ownerId: profile.id });

    if (filters?.status) {
      queryBuilder.andWhere('booking.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.dateFrom) {
      queryBuilder.andWhere('booking.date >= :dateFrom', {
        dateFrom: filters.dateFrom,
      });
    }

    if (filters?.dateTo) {
      queryBuilder.andWhere('booking.date <= :dateTo', {
        dateTo: filters.dateTo,
      });
    }

    queryBuilder
      .orderBy('booking.date', 'ASC')
      .addOrderBy('booking.time', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: string, ownerId: string): Promise<Booking> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { userId: ownerId },
    });

    if (!profile) {
      throw new NotFoundException('Профиль владельца не найден');
    }

    const booking = await this.bookingRepository.findOne({
      where: { id, ownerId: profile.id },
    });

    if (!booking) {
      throw new NotFoundException('Запись не найдена');
    }

    return booking;
  }

  async create(
    createDto: CreateBookingDto,
    ownerPublicId: string,
  ): Promise<Booking> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { publicId: ownerPublicId },
    });

    if (!profile) {
      throw new NotFoundException('Владелец не найден');
    }

    // Проверяем, что дата не в прошлом
    const bookingDate = new Date(createDto.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      throw new BadRequestException(
        'Нельзя создать бронирование на прошедшую дату',
      );
    }

    // Проверяем доступность слота
    await this.validateSlotAvailability(
      profile.id,
      createDto.date,
      createDto.time,
    );

    const booking = this.bookingRepository.create({
      ownerId: profile.id,
      clientName: createDto.clientName,
      clientContact: createDto.clientContact,
      date: createDto.date,
      time: createDto.time,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepository.save(booking);
  }

  async updateStatus(
    id: string,
    ownerId: string,
    updateDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id, ownerId);
    booking.status = updateDto.status;
    return this.bookingRepository.save(booking);
  }

  async cancel(id: string, ownerId: string): Promise<Booking> {
    const booking = await this.findOne(id, ownerId);
    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }

  async getUnreadCount(ownerId: string): Promise<number> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { userId: ownerId },
    });

    if (!profile) {
      return 0;
    }

    return this.bookingRepository.count({
      where: {
        ownerId: profile.id,
        readAt: IsNull(),
      },
    });
  }

  async markAllAsRead(ownerId: string): Promise<void> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { userId: ownerId },
    });

    if (!profile) {
      return;
    }

    await this.bookingRepository.update(
      {
        ownerId: profile.id,
        readAt: IsNull(),
      },
      { readAt: new Date() },
    );
  }

  private async validateSlotAvailability(
    ownerId: string,
    date: string,
    time: string,
  ): Promise<void> {
    // Проверяем, есть ли активное бронирование на этот слот (отменённые и отклонённые освобождают слот)
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        ownerId,
        date,
        time,
        status: Not(In([BookingStatus.CANCELLED, BookingStatus.REJECTED])),
      },
    });

    if (existingBooking) {
      throw new BadRequestException('Слот уже занят');
    }

    // Проверяем, что слот существует в расписании
    const schedule = await this.scheduleRepository.findOne({
      where: { ownerId },
    });

    if (!schedule || !schedule.days || schedule.days.length === 0) {
      throw new BadRequestException('Расписание не настроено');
    }

    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getDay();
    const activeDay = schedule.days.find(
      (day) => day.dayOfWeek === dayOfWeek && day.isActive,
    );

    if (!activeDay) {
      throw new BadRequestException('В этот день нет доступных слотов');
    }

    // Проверяем, что время попадает в один из timeBlocks
    const timeInMinutes = this.parseTime(time);
    const isValidTime = activeDay.timeBlocks.some((block) => {
      const startMinutes = this.parseTime(block.startTime);
      const endMinutes = this.parseTime(block.endTime);
      return timeInMinutes >= startMinutes && timeInMinutes < endMinutes;
    });

    if (!isValidTime) {
      throw new BadRequestException('Выбранное время недоступно');
    }
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
