import {
  Controller,
  Get,
  Post,
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
  @ApiQuery({ name: 'service_id', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Список доступных слотов' })
  @ApiResponse({ status: 404, description: 'Владелец не найден' })
  @ApiResponse({ status: 400, description: 'Неверный формат даты' })
  async getAvailableSlots(
    @Param('ownerId') ownerId: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('service_id') serviceId?: string,
  ) {
    return this.publicService.getAvailableSlots(ownerId, startDate, endDate, serviceId);
  }

  @Get('booking/:id')
  @ApiOperation({ summary: 'Получить данные записи для клиента (постоянная ссылка)' })
  @ApiResponse({ status: 200, description: 'Данные записи и владельца' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  async getBookingForClient(@Param('id') id: string) {
    return this.publicService.getBookingForClient(id);
  }

  @Post('booking/:id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отменить бронирование (для клиента по ссылке)' })
  @ApiResponse({ status: 200, description: 'Бронирование отменено' })
  @ApiResponse({ status: 400, description: 'Запись уже отменена' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  async cancelByClient(@Param('id') id: string) {
    return this.publicService.cancelByClient(id);
  }

  @Get('owner/:ownerId/services')
  @ApiOperation({ summary: 'Получить активные услуги владельца' })
  @ApiResponse({ status: 200, description: 'Список услуг' })
  @ApiResponse({ status: 404, description: 'Владелец не найден' })
  async getServices(@Param('ownerId') ownerId: string) {
    return this.publicService.getServices(ownerId);
  }
}
