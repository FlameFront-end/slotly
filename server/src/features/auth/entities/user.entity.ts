import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import type { OwnerProfile } from '../../owner/entities/owner-profile.entity';
import type { RefreshToken } from './refresh-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(
    () => require('../../owner/entities/owner-profile.entity').OwnerProfile,
    (profile: OwnerProfile) => profile.user,
  )
  ownerProfile: OwnerProfile;

  @OneToMany(
    () => require('./refresh-token.entity').RefreshToken,
    (token: RefreshToken) => token.user,
  )
  refreshTokens: RefreshToken[];
}
