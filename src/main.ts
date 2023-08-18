import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './dispatcher/response.interceptor';
import { NestFactory } from '@nestjs/core';
import { envConfig } from './config/env';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const appPort = envConfig.app.port;

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor());

  const swaggerOptions = new DocumentBuilder()
    .setTitle('NestDemo')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(appPort);
  logger.log(`App is listening on port ${appPort}`);
}
bootstrap();
