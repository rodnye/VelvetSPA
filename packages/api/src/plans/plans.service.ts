import { Injectable, NotFoundException } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { plansTable } from '../database/schema';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectDrizzle } from '@nestjs/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class PlansService {
  constructor(
    @InjectDrizzle()
    private readonly db: NodePgDatabase,
  ) {}

  findActive() {
    return this.db
      .select()
      .from(plansTable)
      .where(eq(plansTable.isActive, true))
      .orderBy(asc(plansTable.price));
  }

  findAll() {
    return this.db.select().from(plansTable).orderBy(asc(plansTable.price));
  }

  async findOne(id: number) {
    const [plan] = await this.db
      .select()
      .from(plansTable)
      .where(eq(plansTable.id, id));
    if (!plan) throw new NotFoundException('Plan no encontrado');
    return plan;
  }

  async create(dto: CreatePlanDto) {
    return this.db
      .insert(plansTable)
      .values({ ...dto, price: dto.price.toFixed(2) })
      .returning()
      .then(([plan]) => plan);
  }

  async update(id: number, dto: UpdatePlanDto) {
    await this.findOne(id);
    const [plan] = await this.db
      .update(plansTable)
      .set({ ...dto, price: dto.price?.toFixed(2) })
      .where(eq(plansTable.id, id))
      .returning();
    return plan;
  }

  async remove(id: number) {
    await this.findOne(id);
    const [plan] = await this.db
      .update(plansTable)
      .set({ isActive: false })
      .where(eq(plansTable.id, id))
      .returning();
    return plan;
  }
}
