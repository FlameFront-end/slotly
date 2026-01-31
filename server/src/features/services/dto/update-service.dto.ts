import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class UpdateServiceDto {
  @ApiProperty({ example: 'Консультация', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Первичная консультация по вопросам...', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 60, description: 'Длительность в минутах', required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;

  @ApiProperty({ example: 1500.50, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @IsOptional()
  order?: number;
}
