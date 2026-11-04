import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 8000);
}
await bootstrap().catch((error) => {
  Logger.error('Error starting server', error);
  process.exit(1);
});
