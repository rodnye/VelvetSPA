import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DrizzleModule } from '@nestjs/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PlansModule } from './plans/plans.module';
import { ServicesModule } from './services/services.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DrizzleModule.forRoot({
      drizzle,
      connection:
        process.env.DATABASE_URL! ||
        'postgresql://postgres:postgres@localhost:13456/postgres',
    }),
    AuthModule,
    UsersModule,
    ServicesModule,
    PlansModule,
    SubscriptionsModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
