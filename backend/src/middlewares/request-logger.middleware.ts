import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl: url } = request;

    response.on('close', () => {
      const { statusCode } = response;

      this.logger.log(`${method} ${statusCode}: ${url}`);
    });

    next();
  }
}
