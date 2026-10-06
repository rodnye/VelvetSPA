import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { version } from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
bootstrap();
