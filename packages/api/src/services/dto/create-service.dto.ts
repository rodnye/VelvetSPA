import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export const SERVICE_CATEGORIES = [
  'faciales',
  'dermapen',
  'masajes_corporales',
  'depilacion',
  'corporales',
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export class CreateServiceDto {
  @ApiProperty({ example: 'Masaje relajante' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'Masaje corporal con aceites esenciales.' })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description?: string;

  @ApiProperty({
    enum: SERVICE_CATEGORIES,
    example: 'masajes_corporales',
    description: 'Categoría del servicio',
  })
  @IsEnum(SERVICE_CATEGORIES)
  category: ServiceCategory;

  @ApiProperty({ example: 60, description: 'Duración en minutos' })
  @IsInt()
  @Min(5)
  durationMin: number;

  @ApiProperty({ example: 35.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;
}
