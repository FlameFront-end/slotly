import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import type { User } from '../../auth/entities/user.entity';
import type { Schedule } from '../../schedule/entities/schedule.entity';
import type { Booking } from '../../bookings/entities/booking.entity';
import type { Service } from '../../services/entities/service.entity';

export interface ContactMethod {
  enabled: boolean;
  value: string;
}

export interface ContactMethods {
  telegram?: ContactMethod;
  email?: ContactMethod;
  phone?: ContactMethod;
  whatsapp?: ContactMethod;
}

export interface SocialLink {
  enabled: boolean;
  value: string;
}

export interface SocialLinks {
  instagram?: SocialLink;
  vk?: SocialLink;
  facebook?: SocialLink;
  youtube?: SocialLink;
  tiktok?: SocialLink;
  ok?: SocialLink;
}

@Entity('owner_profiles')
export class OwnerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @ManyToOne(
    () => require('../../auth/entities/user.entity').User,
    (user: User) => user.ownerProfile,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  contact: string;

  @Column({ default: 'UTC' })
  timezone: string;

  @Column({ name: 'public_id', unique: true })
  publicId: string;

  @Column({ name: 'contact_methods', type: 'jsonb', nullable: true })
  contactMethods: ContactMethods;

  @Column({ name: 'social_links', type: 'jsonb', nullable: true })
  socialLinks: SocialLinks;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'map_link', type: 'text', nullable: true })
  mapLink: string;

  @Column({ type: 'text', nullable: true })
  website: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(
    () => require('../../schedule/entities/schedule.entity').Schedule,
    (schedule: Schedule) => schedule.ownerProfile,
  )
  schedule: Schedule;

  @OneToMany(
    () => require('../../bookings/entities/booking.entity').Booking,
    (booking: Booking) => booking.ownerProfile,
  )
  bookings: Booking[];

  @OneToMany(
    () => require('../../services/entities/service.entity').Service,
    (service: Service) => service.ownerProfile,
  )
  services: Service[];
}
