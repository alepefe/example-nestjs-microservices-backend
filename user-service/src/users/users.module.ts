import { Module } from '@nestjs/common';
import { FindUserController } from './infrastructure/controllers/find-user.controller';
import { SearchUsersController } from './infrastructure/controllers/search-users.controller';
import { AuthenticateUserController } from './infrastructure/controllers/authenticate-user.controller';
import { AuthenticateUserUseCase } from './application/authenticate-user/authenticate-user.use-case';
import { PostgresUserRepository } from './infrastructure/persistence/postgres-user.repository';
import { UserRepository } from './domain/user.repository';
import { JWTProvider } from './infrastructure/jwt/jwt-provider';
import { RegisterUserController } from './infrastructure/controllers/register-user.controller';
import { RegisterUserUseCase } from './application/register-user/register-user.use-case';
import { PinoLogger } from '../shared/infrastructure/pino.logger';
import { Logger } from '../shared/domain/logger';
import PostgresUserPool from './infrastructure/persistence/postgres-user-pool';
import { RegisterUserWithLocalStrategyUseCase } from './application/register-user/register-user-with-local-strategy.use-case';
import { AuthenticateUserWithLocalStrategyUseCase } from './application/authenticate-user/authenticate-user-with-local-strategy.use-case';
import { AuthenticateUserWithRefreshStrategyUseCase } from './application/authenticate-user/authenticate-user-with-refresh-strategy.use-case';
import { AuthenticateUserWithGoogleAccessTokenStrategyUseCase } from './application/authenticate-user/authenticate-user-with-google-access-token-strategy.use-case';
import { AuthenticateUserWithGoogleIdTokenStrategyUseCase } from './application/authenticate-user/authenticate-user-with-google-id-token-strategy.use-case';
import { FindUserUseCase } from './application/find-user/find-user.use-case';
import { JWKSController } from './infrastructure/controllers/jwks.controller';
import { RegisterUserWithGoogleStrategyUseCase } from './application/register-user/register-user-with-google-strategy.use-case';
import { EmailSender } from '../shared/domain/email-sender';
import UserSMTPConfig from './infrastructure/persistence/user-smtp-config';
import { SendVerificationEmailUseCase } from './application/send-verification-email/send-verification-email.use-case';
import { VerifyEmailUseCase } from './application/verify-email/verify-email.use-case';
import { SendVerificationEmailController } from './infrastructure/controllers/send-verificaiton-email.controller';
import { VerifyEmailController } from './infrastructure/controllers/verify-email.controller';
import UserNodeEmailSender from './infrastructure/smtp/user-node-email-sender';
import { ChangePasswordUseCase } from './application/change-password/change-password.use-case';
import { ChangePasswordController } from './infrastructure/controllers/change-password.controller';
import { InMemoryPasswordResetAttemptStore } from './infrastructure/persistence/in-memory-password-reset-attempt-store';
import { PasswordResetAttemptStore } from './domain/password-reset-attempt-store';
import { InMemoryLoginAttemptStore } from './infrastructure/persistence/in-memory-login-attempt-store';
import { LoginAttemptStore } from './domain/login-attempt-store';
import { ResetPasswordUseCase } from './application/reset-password/reset-password.use-case';
import { SendResetPasswordEmailUseCase } from './application/send-reset-password-email/send-reset-password-email.use-case';
import { ResetPasswordController } from './infrastructure/controllers/reset-password.controller';
import { SendResetPasswordEmailController } from './infrastructure/controllers/send-reset-password-email.controller';

@Module({
  imports: [],
  providers: [
    { provide: Logger, useClass: PinoLogger },
    PostgresUserPool,
    { provide: UserRepository, useClass: PostgresUserRepository },
    UserSMTPConfig,
    { provide: EmailSender, useClass: UserNodeEmailSender },
    JWTProvider,
    { 
      provide: PasswordResetAttemptStore,
      useFactory: () => {
        const windowMs = 60 * 60 * 1000; // 1 hour
        const maxAttempts = 999;
        return new InMemoryPasswordResetAttemptStore(windowMs, maxAttempts);
      }
    },
    { 
      provide: LoginAttemptStore,
      useFactory: () => {
        const windowMs = 60 * 60 * 1000; // 1 hour
        const maxAttempts = 999;
        return new InMemoryLoginAttemptStore(windowMs, maxAttempts);
      }
    },
    RegisterUserUseCase,
    RegisterUserWithLocalStrategyUseCase,
    RegisterUserWithGoogleStrategyUseCase,

    AuthenticateUserUseCase,
    AuthenticateUserWithRefreshStrategyUseCase,
    AuthenticateUserWithLocalStrategyUseCase,
    AuthenticateUserWithGoogleIdTokenStrategyUseCase,
    AuthenticateUserWithGoogleAccessTokenStrategyUseCase,

    FindUserUseCase,

    SendVerificationEmailUseCase,
    VerifyEmailUseCase,
    ChangePasswordUseCase,
    SendResetPasswordEmailUseCase,
    ResetPasswordUseCase,
  ],
  controllers: [
    JWKSController,
    FindUserController,
    SearchUsersController,
    RegisterUserController,
    AuthenticateUserController,
    SendVerificationEmailController,
    VerifyEmailController,
    ChangePasswordController,
    SendResetPasswordEmailController,
    ResetPasswordController
  ],
})
export class UsersModule {}
