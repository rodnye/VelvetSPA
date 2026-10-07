import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, desc, eq, gte, inArray, lt } from 'drizzle-orm';
import type { JwtPayload } from '../common/types';
import {
  appointmentsTable,
  servicesTable,
  usersTable,
} from '../database/schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import type { AppointmentStatus } from './dto/update-appointment-status.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { InjectDrizzle } from '@nestjs/drizzle';

const MS_PER_MINUTE = 60_000;
const DAY_MS = 24 * 60 * MS_PER_MINUTE;

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectDrizzle()
    private readonly db: NodePgDatabase,
  ) {}

  async create(userId: number, dto: CreateAppointmentDto) {
    const [service] = await this.db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.id, dto.serviceId));
    if (!service || !service.isActive) {
      throw new NotFoundException('El servicio no está disponible');
    }

    const start = new Date(dto.scheduledAt);
    if (start.getTime() < Date.now()) {
      throw new BadRequestException('No puedes reservar en una fecha pasada');
    }
    const end = new Date(start.getTime() + service.durationMin * MS_PER_MINUTE);

    const nearby = await this.db
      .select({
        id: appointmentsTable.id,
        scheduledAt: appointmentsTable.scheduledAt,
        durationMin: servicesTable.durationMin,
      })
      .from(appointmentsTable)
      .innerJoin(
        servicesTable,
        eq(appointmentsTable.serviceId, servicesTable.id),
      )
      .where(
        and(
          inArray(appointmentsTable.status, ['pending', 'confirmed']),
          gte(
            appointmentsTable.scheduledAt,
            new Date(start.getTime() - DAY_MS),
          ),
          lt(appointmentsTable.scheduledAt, new Date(end.getTime() + DAY_MS)),
        ),
      );

    const overlaps = nearby.some((a) => {
      const aStart = a.scheduledAt.getTime();
      const aEnd = aStart + a.durationMin * MS_PER_MINUTE;
      return aStart < end.getTime() && start.getTime() < aEnd;
    });
    if (overlaps) {
      throw new ConflictException(
        'Ese horario ya está ocupado, elige otra hora',
      );
    }

    const [appointment] = await this.db
      .insert(appointmentsTable)
      .values({
        userId,
        serviceId: service.id,
        scheduledAt: start,
        notes: dto.notes,
      })
      .returning();
    return appointment;
  }

  findMine(userId: number) {
    return this.db
      .select({
        appointment: appointmentsTable,
        service: {
          id: servicesTable.id,
          name: servicesTable.name,
          durationMin: servicesTable.durationMin,
          price: servicesTable.price,
        },
      })
      .from(appointmentsTable)
      .innerJoin(
        servicesTable,
        eq(appointmentsTable.serviceId, servicesTable.id),
      )
      .where(eq(appointmentsTable.userId, userId))
      .orderBy(desc(appointmentsTable.scheduledAt));
  }

  findAll() {
    return this.db
      .select({
        appointment: appointmentsTable,
        service: { id: servicesTable.id, name: servicesTable.name },
        user: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        },
      })
      .from(appointmentsTable)
      .innerJoin(
        servicesTable,
        eq(appointmentsTable.serviceId, servicesTable.id),
      )
      .innerJoin(usersTable, eq(appointmentsTable.userId, usersTable.id))
      .orderBy(asc(appointmentsTable.scheduledAt));
  }

  async findOne(actor: JwtPayload, id: number) {
    const [appointment] = await this.db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, id));
    if (!appointment) throw new NotFoundException('Cita no encontrada');
    if (actor.role === 'client' && appointment.userId !== actor.sub) {
      throw new ForbiddenException('No puedes ver citas de otros usuarios');
    }
    return appointment;
  }

  async updateStatus(actor: JwtPayload, id: number, status: AppointmentStatus) {
    const appointment = await this.findOne(actor, id);

    if (actor.role === 'client' && status !== 'cancelled') {
      throw new ForbiddenException('Como cliente solo puedes cancelar tu cita');
    }
    if (['completed', 'cancelled'].includes(appointment.status)) {
      throw new BadRequestException(
        'No se puede modificar una cita completada o cancelada',
      );
    }

    const [updated] = await this.db
      .update(appointmentsTable)
      .set({ status })
      .where(eq(appointmentsTable.id, id))
      .returning();
    return updated;
  }
}
