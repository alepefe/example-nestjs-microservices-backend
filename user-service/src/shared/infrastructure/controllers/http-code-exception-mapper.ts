import { HttpStatus } from '@nestjs/common';

const ERROR_MAPPINGS: Record<string, number> = {
  InvalidArgumentError: HttpStatus.BAD_REQUEST,
  ObjectNotFoundError: HttpStatus.NOT_FOUND,
  ObjectAlreadyExistsError: HttpStatus.CONFLICT,
  EmailAlreadyExistsError : HttpStatus.CONFLICT,
  EmailAlreadyVerifiedError: HttpStatus.CONFLICT,
  TooManyVerificationCodesSentError: HttpStatus.TOO_MANY_REQUESTS,
  AuthorizationError: HttpStatus.UNAUTHORIZED,
  AuthenticationError: HttpStatus.UNAUTHORIZED,
  ServiceUnavailableError: HttpStatus.SERVICE_UNAVAILABLE,
  NotImplementedError: HttpStatus.NOT_IMPLEMENTED
};

function map (err: any): any {
  if (err.constructor.name in ERROR_MAPPINGS) {
    return ERROR_MAPPINGS[err.constructor.name];
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
}

const HTTPCodeExceptionMapper = {
  ERROR_MAPPINGS,
  map
} as const;

export default HTTPCodeExceptionMapper;
