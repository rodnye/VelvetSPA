import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { version } from '../package.json';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(
    '/docs',
    apiReference({
      content: SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('VelvetSPA API')
          .setDescription('Backend del servidor de este SPA')
          .setVersion(version)
          .addBearerAuth()
          .build(),
      ),
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
