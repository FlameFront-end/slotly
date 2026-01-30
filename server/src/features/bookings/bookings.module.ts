import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { OwnerProfile } from '../owner/entities/owner-profile.entity';
import { Schedule } from '../schedule/entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, OwnerProfile, Schedule])],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
