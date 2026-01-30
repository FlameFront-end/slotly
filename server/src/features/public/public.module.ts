import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { OwnerProfile } from '../owner/entities/owner-profile.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OwnerProfile, Schedule, Booking])],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
