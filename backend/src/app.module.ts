import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from '@config';
import { CacheControlMiddleware, RequestLoggerMiddleware } from '@middlewares';
import { MovieModule } from '@modules';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    MovieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CacheControlMiddleware, RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
