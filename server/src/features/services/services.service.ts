import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { OwnerProfile } from '../owner/entities/owner-profile.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(OwnerProfile)
    private ownerProfileRepository: Repository<OwnerProfile>,
  ) {}

  async findAll(ownerId: string, includeInactive = false): Promise<Service[]> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { userId: ownerId },
    });

    if (!profile) {
      throw new NotFoundException('Профиль владельца не найден');
    }

    const where: any = { ownerId: profile.id };
    if (!includeInactive) {
      where.isActive = true;
    }

    return this.serviceRepository.find({
      where,
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string, ownerId: string): Promise<Service> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { userId: ownerId },
    });

    if (!profile) {
      throw new NotFoundException('Профиль владельца не найден');
    }

    const service = await this.serviceRepository.findOne({
      where: { id, ownerId: profile.id },
    });

    if (!service) {
      throw new NotFoundException('Услуга не найдена');
    }

    return service;
  }

  async create(
    ownerId: string,
    createDto: CreateServiceDto,
  ): Promise<Service> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { userId: ownerId },
    });

    if (!profile) {
      throw new NotFoundException('Профиль владельца не найден');
    }

    const service = this.serviceRepository.create({
      ownerId: profile.id,
      name: createDto.name,
      description: createDto.description,
      duration: createDto.duration,
      price: createDto.price ?? null,
      isActive: createDto.isActive ?? true,
      order: createDto.order ?? 0,
    });

    return this.serviceRepository.save(service);
  }

  async update(
    id: string,
    ownerId: string,
    updateDto: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.findOne(id, ownerId);

    Object.assign(service, updateDto);
    return this.serviceRepository.save(service);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const service = await this.findOne(id, ownerId);
    await this.serviceRepository.remove(service);
  }

  async getPublicServices(ownerPublicId: string): Promise<Service[]> {
    const profile = await this.ownerProfileRepository.findOne({
      where: { publicId: ownerPublicId },
    });

    if (!profile) {
      throw new NotFoundException('Владелец не найден');
    }

    return this.serviceRepository.find({
      where: { ownerId: profile.id, isActive: true },
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async findByIdAndOwner(id: string, ownerId: string): Promise<Service | null> {
    return this.serviceRepository.findOne({
      where: { id, ownerId, isActive: true },
    });
  }
}
