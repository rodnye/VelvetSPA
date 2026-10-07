import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq, lt } from 'drizzle-orm';
import type { JwtPayload } from '../common/types';
import { plansTable, subscriptionsTable } from '../database/schema';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { InjectDrizzle } from '@nestjs/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

const withPlan = {
  subscription: subscriptionsTable,
  plan: {
    id: plansTable.id,
    name: plansTable.name,
    price: plansTable.price,
    durationDays: plansTable.durationDays,
  },
};

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectDrizzle()
    private readonly db: NodePgDatabase,
  ) {}

  async subscribe(userId: number, dto: CreateSubscriptionDto) {
    const [plan] = await this.db
      .select()
      .from(plansTable)
      .where(eq(plansTable.id, dto.planId));
    if (!plan || !plan.isActive) {
      throw new NotFoundException('El plan no está disponible');
    }

    await this.expireOverdue(userId);

    const [active] = await this.db
      .select({ id: subscriptionsTable.id })
      .from(subscriptionsTable)
      .where(
        and(
          eq(subscriptionsTable.userId, userId),
          eq(subscriptionsTable.status, 'active'),
        ),
      );
    if (active) {
      throw new ConflictException('Ya tienes una suscripción activa');
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const [subscription] = await this.db
      .insert(subscriptionsTable)
      .values({ userId, planId: plan.id, endDate })
      .returning();
    return subscription;
  }

  async findMine(userId: number) {
    await this.expireOverdue(userId);
    return this.db
      .select(withPlan)
      .from(subscriptionsTable)
      .innerJoin(plansTable, eq(subscriptionsTable.planId, plansTable.id))
      .where(eq(subscriptionsTable.userId, userId))
      .orderBy(desc(subscriptionsTable.createdAt));
  }

  async findAll() {
    await this.expireOverdue();
    return this.db
      .select(withPlan)
      .from(subscriptionsTable)
      .innerJoin(plansTable, eq(subscriptionsTable.planId, plansTable.id))
      .orderBy(desc(subscriptionsTable.createdAt));
  }

  async cancel(actor: JwtPayload, id: number) {
    const [subscription] = await this.db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.id, id));
    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada');
    }
    if (actor.role !== 'admin' && subscription.userId !== actor.sub) {
      throw new ForbiddenException(
        'Solo puedes cancelar tus propias suscripciones',
      );
    }
    if (subscription.status !== 'active') {
      throw new BadRequestException(
        'Solo se pueden cancelar suscripciones activas',
      );
    }

    const [updated] = await this.db
      .update(subscriptionsTable)
      .set({ status: 'cancelled' })
      .where(eq(subscriptionsTable.id, id))
      .returning();
    return updated;
  }

  private async expireOverdue(userId?: number) {
    const conditions = [
      eq(subscriptionsTable.status, 'active'),
      lt(subscriptionsTable.endDate, new Date()),
    ];
    if (userId) conditions.push(eq(subscriptionsTable.userId, userId));
    await this.db
      .update(subscriptionsTable)
      .set({ status: 'expired' })
      .where(and(...conditions));
  }
}
