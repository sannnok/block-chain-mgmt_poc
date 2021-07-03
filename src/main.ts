import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const allowedOrigins = [
  'http://beingno.one:3000',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const opt: CorsOptions = {
    origin: true
  }
  app.enableCors({
    origin: true,
  });
  await app.listen(3000);
}
bootstrap();
