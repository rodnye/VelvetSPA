import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { UserRole } from '../../common/types';

export class CreateUserDto {
  @ApiProperty({ example: 'Laura Gómez' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'laura@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'secreto123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;

  @ApiPropertyOptional({ example: '+5351234567' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @ApiPropertyOptional({ enum: ['admin', 'employee', 'client'] })
  @IsOptional()
  @IsIn(['admin', 'employee', 'client'])
  role?: UserRole;
}
