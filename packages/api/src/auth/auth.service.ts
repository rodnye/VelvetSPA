import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { usersTable } from '../database/schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { InjectDrizzle } from '@nestjs/drizzle';

@Injectable()
export class AuthService {
  constructor(
    @InjectDrizzle()
    private readonly db: NodePgDatabase,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const [existing] = await this.db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, dto.email));
    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }

    const password = await bcrypt.hash(dto.password, 10);
    const [user] = await this.db
      .insert(usersTable)
      .values({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password,
      })
      .returning();

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email));
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.buildAuthResponse(user);
  }

  async getProfile(userId: number) {
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.toPublicUser(user);
  }

  private buildAuthResponse(user: typeof usersTable.$inferSelect) {
    const accessToken = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { accessToken, user: this.toPublicUser(user) };
  }

  private toPublicUser(user: typeof usersTable.$inferSelect) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
