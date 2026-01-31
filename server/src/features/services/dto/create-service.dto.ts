import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Консультация' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Первичная консультация по вопросам...', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 60, description: 'Длительность в минутах' })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 1500.50, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 0, required: false, default: 0 })
  @IsInt()
  @IsOptional()
  order?: number;
}
