import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { OwnerProfile } from '../../owner/entities/owner-profile.entity';

export interface TimeBlock {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  slotDuration: number; // minutes
}

export interface ScheduleDay {
  id: string;
  dayOfWeek: number; // 0-6 (0 = Sunday)
  timeBlocks: TimeBlock[];
  isActive: boolean;
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_id', unique: true })
  ownerId: string;

  @ManyToOne(() => OwnerProfile, (profile: OwnerProfile) => profile.schedule)
  @JoinColumn({ name: 'owner_id' })
  ownerProfile: OwnerProfile;

  @Column({ type: 'jsonb' })
  days: ScheduleDay[];

  @Column({ type: 'int', name: 'booking_range_months', default: 2 })
  bookingRangeMonths: number;

  @Column({ type: 'jsonb', default: [] })
  exceptions: unknown[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
