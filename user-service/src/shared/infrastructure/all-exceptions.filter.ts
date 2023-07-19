
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import HTTPCodeExceptionMapper from './controllers/http-code-exception-mapper';
import { Logger } from '../domain/logger';
import { RequestWitDomainRequestContext } from './controllers/request-with-context';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const request = ctx.getRequest() as RequestWitDomainRequestContext;
    const response = ctx.getResponse();

    if(exception instanceof HttpException) {
      this.logger.error(exception, request.domainRequestContext);
      httpAdapter.reply(response, exception.getResponse(), exception.getStatus());
    } else {
      this.logger.error(exception, request.domainRequestContext);
      httpAdapter.reply(response, { errors: [{ name: exception.constructor.name, message: exception.message }] }, HTTPCodeExceptionMapper.map(exception));
    }
  }
}
