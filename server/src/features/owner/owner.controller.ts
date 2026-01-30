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
import { OwnerService } from './owner.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('owner')
@Controller('owner')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OwnerController {
  constructor(private ownerService: OwnerService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Получить профиль владельца' })
  @ApiResponse({ status: 200, description: 'Профиль найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Профиль не найден' })
  async getProfile(@CurrentUser() user: any) {
    return this.ownerService.getProfile(user.userId);
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновить профиль владельца' })
  @ApiResponse({ status: 200, description: 'Профиль обновлен' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации данных' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.ownerService.updateProfile(user.userId, updateDto);
  }
}
