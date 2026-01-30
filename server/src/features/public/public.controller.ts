import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PublicService } from './public.service';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('owner/:publicId')
  @ApiOperation({ summary: 'Получить публичный профиль владельца' })
  @ApiResponse({ status: 200, description: 'Профиль найден' })
  @ApiResponse({ status: 404, description: 'Профиль не найден' })
  async getOwnerProfile(@Param('publicId') publicId: string) {
    return this.publicService.getOwnerProfile(publicId);
  }

  @Get('schedule/:ownerId/slots')
  @ApiOperation({ summary: 'Получить доступные слоты для бронирования' })
  @ApiQuery({ name: 'start_date', required: false, type: String })
  @ApiQuery({ name: 'end_date', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Список доступных слотов' })
  @ApiResponse({ status: 404, description: 'Владелец не найден' })
  @ApiResponse({ status: 400, description: 'Неверный формат даты' })
  async getAvailableSlots(
    @Param('ownerId') ownerId: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    return this.publicService.getAvailableSlots(ownerId, startDate, endDate);
  }

  @Get('booking/:id')
  @ApiOperation({ summary: 'Получить данные записи для клиента (постоянная ссылка)' })
  @ApiResponse({ status: 200, description: 'Данные записи и владельца' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  async getBookingForClient(@Param('id') id: string) {
    return this.publicService.getBookingForClient(id);
  }
}
