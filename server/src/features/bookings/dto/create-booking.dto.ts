import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  Matches,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsString()
  @IsNotEmpty()
  clientContact: string;

  @ApiProperty({ example: '2026-02-15' })
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'time must be in HH:mm format',
  })
  time: string;

  @ApiProperty({
    example: 'uuid-of-owner',
    required: false,
    description: 'Public ID владельца (можно передать в query параметре)',
  })
  @IsString()
  @IsOptional()
  ownerId?: string;
}
