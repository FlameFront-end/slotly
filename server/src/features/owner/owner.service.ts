import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnerProfile } from './entities/owner-profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(OwnerProfile)
    private ownerProfileRepository: Repository<OwnerProfile>,
  ) {}

  async getProfile(userId: string): Promise<OwnerProfile> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Профиль не найден');
    }

    return profile;
  }

  async updateProfile(
    userId: string,
    updateDto: UpdateProfileDto,
  ): Promise<OwnerProfile> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Профиль не найден');
    }

    Object.assign(profile, updateDto);
    return this.ownerProfileRepository.save(profile);
  }

  async getPublicProfile(publicId: string): Promise<OwnerProfile> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { publicId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Профиль не найден');
    }

    return profile;
  }
}
