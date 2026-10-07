import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Public()
  @Get()
  @ApiQuery({
    name: 'category',
    required: false,
    enum: [
      'faciales',
      'dermapen',
      'masajes_corporales',
      'depilacion',
      'corporales',
    ],
    description: 'Filtrar por categoría de servicio',
  })
  findActive(@Query('category') category?: string) {
    return this.services.findActive(category);
  }

  @Get('all')
  @Roles('admin')
  @ApiBearerAuth()
  findAll() {
    return this.services.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.services.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiBearerAuth()
  create(@Body() dto: CreateServiceDto) {
    return this.services.create(dto);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServiceDto) {
    return this.services.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.services.remove(id);
  }
}
