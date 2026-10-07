import { Injectable, NotFoundException } from '@nestjs/common';
import { asc, eq, and } from 'drizzle-orm';
import { servicesTable } from '../database/schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectDrizzle } from '@nestjs/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class ServicesService {
  constructor(
    @InjectDrizzle()
    private readonly db: NodePgDatabase,
  ) {}

  findActive(category?: string) {
    const conditions = [eq(servicesTable.isActive, true)];
    if (category) {
      conditions.push(
        eq(
          servicesTable.category,
          category as (typeof servicesTable.category.enumValues)[number],
        ),
      );
    }
    return this.db
      .select()
      .from(servicesTable)
      .where(and(...conditions))
      .orderBy(asc(servicesTable.category), asc(servicesTable.name));
  }

  findAll() {
    return this.db
      .select()
      .from(servicesTable)
      .orderBy(asc(servicesTable.category), asc(servicesTable.name));
  }

  async findOne(id: number) {
    const [service] = await this.db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.id, id));
    if (!service) throw new NotFoundException('Servicio no encontrado');
    return service;
  }

  async create(dto: CreateServiceDto) {
    return this.db
      .insert(servicesTable)
      .values({ ...dto, price: dto.price.toFixed(2) })
      .returning()
      .then(([service]) => service);
  }

  async update(id: number, dto: UpdateServiceDto) {
    await this.findOne(id);
    const [service] = await this.db
      .update(servicesTable)
      .set({ ...dto, price: dto.price?.toFixed(2) })
      .where(eq(servicesTable.id, id))
      .returning();
    return service;
  }

  async remove(id: number) {
    await this.findOne(id);
    const [service] = await this.db
      .update(servicesTable)
      .set({ isActive: false })
      .where(eq(servicesTable.id, id))
      .returning();
    return service;
  }
}
