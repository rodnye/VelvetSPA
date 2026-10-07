import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { JwtPayload } from '../common/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.users.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    this.ensureSelfOrAdmin(id, user);
    return this.users.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    this.ensureSelfOrAdmin(id, user);
    return this.users.update(id, dto, user);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.users.remove(id);
  }

  private ensureSelfOrAdmin(id: number, user: JwtPayload) {
    if (user.role !== 'admin' && user.sub !== id) {
      throw new ForbiddenException('Solo puedes gestionar tu propio perfil');
    }
  }
}
