import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 1, description: 'ID del servicio a reservar' })
  @IsInt()
  @Min(1)
  serviceId: number;

  @ApiProperty({
    example: '2026-10-15T14:00:00.000Z',
    description: 'Fecha y hora de la cita (ISO 8601)',
  })
  @IsDateString()
  scheduledAt: string;

  @ApiPropertyOptional({ example: 'Prefiero una cabina tranquila.' })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  notes?: string;
}
