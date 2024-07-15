import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(process.env.APP_PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
