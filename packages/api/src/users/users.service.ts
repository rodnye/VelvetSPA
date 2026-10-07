import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { eq, ne, and } from 'drizzle-orm';
import type { JwtPayload } from '../common/types';
import { usersTable } from '../database/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { InjectDrizzle } from '@nestjs/drizzle';

const publicColumns = {
  id: usersTable.id,
  name: usersTable.name,
  email: usersTable.email,
  phone: usersTable.phone,
  role: usersTable.role,
  createdAt: usersTable.createdAt,
  updatedAt: usersTable.updatedAt,
};

@Injectable()
export class UsersService {
  constructor(
    @InjectDrizzle()
    private readonly db: NodePgDatabase,
  ) {}

  async create(dto: CreateUserDto) {
    await this.ensureEmailAvailable(dto.email);
    const password = await bcrypt.hash(dto.password, 10);
    const [user] = await this.db
      .insert(usersTable)
      .values({ ...dto, password })
      .returning(publicColumns);
    return user;
  }

  findAll() {
    return this.db.select(publicColumns).from(usersTable);
  }

  async findOne(id: number) {
    const [user] = await this.db
      .select(publicColumns)
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUserDto, actor: JwtPayload) {
    await this.findOne(id);

    if (dto.role && actor.role !== 'admin') {
      throw new ForbiddenException('Solo un administrador puede cambiar roles');
    }
    if (dto.email) await this.ensureEmailAvailable(dto.email, id);

    const password = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;

    const [user] = await this.db
      .update(usersTable)
      .set({ ...dto, password, updatedAt: new Date() })
      .where(eq(usersTable.id, id))
      .returning(publicColumns);
    return user;
  }

  async remove(id: number) {
    const [user] = await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning({ id: usersTable.id });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return { deleted: true, id };
  }

  private async ensureEmailAvailable(email: string, exceptId?: number) {
    const conditions = [eq(usersTable.email, email)];
    if (exceptId) conditions.push(ne(usersTable.id, exceptId));
    const [existing] = await this.db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(and(...conditions));
    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }
  }
}
