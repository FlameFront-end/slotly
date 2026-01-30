import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { BookingStatus } from './entities/booking.entity';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Количество непрочитанных записей' })
  @ApiResponse({ status: 200, description: 'Число непрочитанных' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async getUnreadCount(@CurrentUser() user: any) {
    const count = await this.bookingsService.getUnreadCount(user.userId);
    return { count };
  }

  @Post('mark-read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отметить все записи как прочитанные' })
  @ApiResponse({ status: 200, description: 'Выполнено' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async markAllAsRead(@CurrentUser() user: any) {
    await this.bookingsService.markAllAsRead(user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все бронирования' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  @ApiQuery({ name: 'date_from', required: false, type: String })
  @ApiQuery({ name: 'date_to', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Список бронирований' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async findAll(
    @CurrentUser() user: any,
    @Query('status') status?: BookingStatus,
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
  ) {
    return this.bookingsService.findAll(user.userId, {
      status,
      dateFrom,
      dateTo,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить конкретное бронирование' })
  @ApiResponse({ status: 200, description: 'Бронирование найдено' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.findOne(id, user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать бронирование (публичный эндпоинт)' })
  @ApiQuery({
    name: 'ownerId',
    required: false,
    description: 'Public ID владельца (можно передать в теле запроса)',
  })
  @ApiResponse({ status: 201, description: 'Бронирование создано' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации или слот занят' })
  async create(
    @Body() createDto: CreateBookingDto,
    @Query('ownerId') ownerId?: string,
  ) {
    const publicId = createDto.ownerId || ownerId;
    if (!publicId) {
      throw new BadRequestException(
        'ownerId обязателен (в теле запроса или query параметре)',
      );
    }
    // Удаляем ownerId из DTO перед передачей в сервис
    const { ownerId: _, ...bookingDto } = createDto;
    return this.bookingsService.create(bookingDto, publicId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Изменить статус бронирования' })
  @ApiResponse({ status: 200, description: 'Статус изменен' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, user.userId, updateDto);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отменить бронирование' })
  @ApiResponse({ status: 200, description: 'Бронирование отменено' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  async cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.cancel(id, user.userId);
  }
}
