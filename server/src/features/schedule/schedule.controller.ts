import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('schedule')
@Controller('schedule')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  @ApiOperation({ summary: 'Получить расписание' })
  @ApiResponse({ status: 200, description: 'Расписание найдено' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async getSchedule(@CurrentUser() user: any) {
    return this.scheduleService.getSchedule(user.userId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновить расписание' })
  @ApiResponse({ status: 200, description: 'Расписание обновлено' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации данных' })
  async updateSchedule(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.updateSchedule(user.userId, updateDto);
  }
}
