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

  // Case whitelist defined
  const whitelist = ['http://beingno.one'];
  app.enableCors({
    origin: (origin, callback) => {
      console.log("handling....", origin);  
    if (whitelist.indexOf(origin) !== -1) {
        console.log("allowed cors for:", origin)
        callback(null, true)
      } else {
        console.log("blocked cors for:", origin)
        callback(new Error('Not allowed by CORS'))
      }
    },
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
