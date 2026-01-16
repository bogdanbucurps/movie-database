import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';

import { config } from '@config';
import { RequestExceptionFilter } from '@exceptions';
import { EErrorCode } from '@resources';
import { formatErrors } from '@utilities';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

(async () => {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true, credentials: true });

  app.use(helmet.contentSecurityPolicy());
  app.use(helmet.crossOriginEmbedderPolicy());
  app.use(helmet.crossOriginOpenerPolicy());
  app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.originAgentCluster());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(
    helmet.strictTransportSecurity({
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    }),
  );
  app.use(helmet.xFrameOptions({ action: 'sameorigin' }));
  app.use(helmet.xssFilter());

  app.useGlobalFilters(new RequestExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 422,
      exceptionFactory: (errors) => ({
        code: EErrorCode.VALIDATION_ERROR,
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Validation error',
        errors: formatErrors(errors),
      }),
    }),
  );

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Movie Database API')
      .setVersion('1.0')
      .build(),
  );

  SwaggerModule.setup('api', app, document);

  await app.listen(config.port);

  const appUrl = await app.getUrl();

  Logger.log(`🚀 Movie Database - API service is running on: ${appUrl}`);
})().catch((error) => {
  Logger.error(error);
  process.exit(1);
});
