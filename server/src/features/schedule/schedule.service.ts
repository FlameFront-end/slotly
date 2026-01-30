import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule, ScheduleDay } from './entities/schedule.entity';
import { OwnerProfile } from '../owner/entities/owner-profile.entity';
import {
  UpdateScheduleDto,
  ScheduleDayDto,
  ScheduleExceptionDto,
} from './dto/update-schedule.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(OwnerProfile)
    private ownerProfileRepository: Repository<OwnerProfile>,
  ) {}

  async getSchedule(ownerId: string): Promise<Schedule> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { userId: ownerId },
    });

    if (!profile) {
      throw new NotFoundException('Профиль владельца не найден');
    }

    let schedule = await this.scheduleRepository.findOne({
      where: { ownerId: profile.id },
    });

    if (!schedule) {
      // Создаем пустое расписание, если его нет
      schedule = this.scheduleRepository.create({
        ownerId: profile.id,
        days: [],
        exceptions: [],
      });
      schedule = await this.scheduleRepository.save(schedule);
    }

    return schedule;
  }

  async updateSchedule(
    ownerId: string,
    updateDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { userId: ownerId },
    });

    if (!profile) {
      throw new NotFoundException('Профиль владельца не найден');
    }

    // Валидация времени
    this.validateSchedule(updateDto.days, updateDto.exceptions || []);

    let schedule = await this.scheduleRepository.findOne({
      where: { ownerId: profile.id },
    });

    // Добавляем id к дням, если их нет
    const daysWithIds: ScheduleDay[] = updateDto.days.map((day) => ({
      id: uuidv4(),
      dayOfWeek: day.dayOfWeek,
      timeBlocks: day.timeBlocks,
      isActive: day.isActive,
    }));

    if (schedule) {
      schedule.days = daysWithIds;
      schedule.exceptions = updateDto.exceptions || [];
      if (updateDto.bookingRangeMonths) {
        schedule.bookingRangeMonths = updateDto.bookingRangeMonths;
      }
      return this.scheduleRepository.save(schedule);
    } else {
      schedule = this.scheduleRepository.create({
        ownerId: profile.id,
        days: daysWithIds,
        exceptions: updateDto.exceptions || [],
        bookingRangeMonths: updateDto.bookingRangeMonths || 2,
      });
      return this.scheduleRepository.save(schedule);
    }
  }

  private validateSchedule(
    days: ScheduleDayDto[],
    exceptions: ScheduleExceptionDto[],
  ): void {
    for (const day of days) {
      for (const timeBlock of day.timeBlocks) {
        const startTime = this.parseTime(timeBlock.startTime);
        const endTime = this.parseTime(timeBlock.endTime);

        if (startTime >= endTime) {
          throw new BadRequestException(
            `startTime должен быть меньше endTime для дня ${day.dayOfWeek}`,
          );
        }

        if (timeBlock.slotDuration <= 0) {
          throw new BadRequestException(
            'slotDuration должен быть положительным числом',
          );
        }
      }
    }

    for (const exception of exceptions) {
      if ((exception.startTime && !exception.endTime) || (!exception.startTime && exception.endTime)) {
        throw new BadRequestException(
          `Для даты ${exception.date} нужно указать и startTime, и endTime`,
        );
      }
      if (exception.startTime && exception.endTime) {
        const startTime = this.parseTime(exception.startTime);
        const endTime = this.parseTime(exception.endTime);
        if (startTime >= endTime) {
          throw new BadRequestException(
            `startTime должен быть меньше endTime для даты ${exception.date}`,
          );
        }
      }
    }
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
