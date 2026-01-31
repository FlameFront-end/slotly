import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import type { OwnerProfile } from '../../owner/entities/owner-profile.entity';
import type { Booking } from '../../bookings/entities/booking.entity';

@Entity('services')
@Index(['ownerId', 'isActive'])
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_id' })
  @Index()
  ownerId: string;

  @ManyToOne(
    () => require('../../owner/entities/owner-profile.entity').OwnerProfile,
    (profile: OwnerProfile) => profile.services,
  )
  @JoinColumn({ name: 'owner_id' })
  ownerProfile: OwnerProfile;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 60 })
  duration: number; // длительность в минутах

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  order: number; // порядок сортировки

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => require('../../bookings/entities/booking.entity').Booking,
    (booking: Booking) => booking.service,
  )
  bookings: Booking[];
}
