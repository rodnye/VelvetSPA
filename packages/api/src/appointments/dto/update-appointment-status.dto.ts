import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export const APPOINTMENT_STATUSES = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export class UpdateAppointmentStatusDto {
  @ApiProperty({ enum: APPOINTMENT_STATUSES, example: 'confirmed' })
  @IsIn(APPOINTMENT_STATUSES)
  status: AppointmentStatus;
}
