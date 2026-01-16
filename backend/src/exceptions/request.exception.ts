import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { type TErrorCode, EErrorCode, type IError } from '@resources';

@Catch()
export class RequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RequestExceptionFilter.name);
  private readonly httpToErrorCodeMap: Partial<Record<HttpStatus, TErrorCode>> =
    {
      [HttpStatus.BAD_REQUEST]: EErrorCode.BAD_REQUEST,
      [HttpStatus.UNAUTHORIZED]: EErrorCode.UNAUTHORIZED,
      [HttpStatus.FORBIDDEN]: EErrorCode.FORBIDDEN,
      [HttpStatus.NOT_FOUND]: EErrorCode.NOT_FOUND,
      [HttpStatus.INTERNAL_SERVER_ERROR]: EErrorCode.INTERNAL_SERVER_ERROR,
      [HttpStatus.UNPROCESSABLE_ENTITY]: EErrorCode.UNPROCESSABLE_ENTITY,
    };

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();

    const status: HttpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error: IError = this.parseHttpError(exception, status);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logInternalErrors(request, error, exception);
    }

    return response.status(status).json(error);
  }

  private parseHttpError(
    exception: HttpException,
    statusCode: HttpStatus,
  ): IError {
    const code = Object.keys(HttpStatus).find(
      (key) => HttpStatus[key as keyof typeof HttpStatus] === statusCode,
    ) as TErrorCode;

    return {
      code: code || EErrorCode.INTERNAL_SERVER_ERROR,
      message: exception.message || 'Internal server error.',
      errors:
        exception instanceof HttpException
          ? (exception.getResponse() as Record<string, string>)
          : exception,
    };
  }

  private logInternalErrors(
    request: Request,
    error: IError,
    exception: Error,
  ): void {
    const requestUrlLog = `[${request.method}] ${request.url}`;

    const requestBody = `[BODY]: ${JSON.stringify(request.body)}`;
    const requestQuery = `[QUERY]: ${JSON.stringify(request.query)}`;

    this.logger.error(
      `Internal server error occurred on ${requestUrlLog}: \n${requestBody}\n${requestQuery}\n[RESPONSE] ${JSON.stringify(
        error,
      )}`,
      exception.stack,
    );
  }
}
