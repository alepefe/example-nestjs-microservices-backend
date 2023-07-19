import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AppLifeCycleControl } from './shared/infrastructure/app-life-cycle-control';
import { PinoLogger } from './shared/infrastructure/pino.logger';
import { Logger } from './shared/domain/logger';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './shared/infrastructure/all-exceptions.filter';
import { ConfigModule } from '@nestjs/config';
import validateEnvVariables from './validate-env-variables';
import { RequestLoggingMiddleware } from './shared/infrastructure/controllers/request-logging.middleware';
import { ExtractRequestContextMiddleware } from './shared/infrastructure/controllers/extract-request-context.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validate: validateEnvVariables
    }),
    UsersModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    { provide: Logger, useClass: PinoLogger },
    AppLifeCycleControl
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtractRequestContextMiddleware).forRoutes('/');
    consumer.apply(RequestLoggingMiddleware).forRoutes('/');
  }
}
