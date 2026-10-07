import type { Request } from 'express';

export type UserRole = 'admin' | 'employee' | 'client';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
