import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type { OwnerProfile } from '../../owner/entities/owner-profile.entity';
import type { Service } from '../../services/entities/service.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Entity('bookings')
@Index(['ownerId', 'date', 'time'], {
  where: `status NOT IN ('cancelled', 'rejected')`,
  unique: true,
})
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_id' })
  @Index()
  ownerId: string;

  @ManyToOne(
    () => require('../../owner/entities/owner-profile.entity').OwnerProfile,
    (profile: OwnerProfile) => profile.bookings,
  )
  @JoinColumn({ name: 'owner_id' })
  ownerProfile: OwnerProfile;

  @Column({ name: 'client_name' })
  clientName: string;

  @Column({ name: 'client_contact' })
  clientContact: string;

  @Column({ type: 'date' })
  @Index()
  date: string;

  @Column({ type: 'time' })
  time: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  @Index()
  status: BookingStatus;

  @Column({ name: 'service_id', nullable: true })
  @Index()
  serviceId: string | null;

  @ManyToOne(
    () => require('../../services/entities/service.entity').Service,
    (service: Service) => service.bookings,
    { nullable: true },
  )
  @JoinColumn({ name: 'service_id' })
  service: Service | null;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt: Date | null = null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
