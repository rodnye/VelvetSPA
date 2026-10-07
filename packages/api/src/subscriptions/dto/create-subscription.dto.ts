import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 1, description: 'ID del plan a suscribir' })
  @IsInt()
  @Min(1)
  planId: number;
}
