
import { type DatabaseError } from 'pg';
import { ObjectAlreadyExistsError } from '../../domain/object-already-exists.error';
import { InvalidArgumentError } from '../../domain/invalid-argument.error';
import { ServiceUnavailableError } from '../../domain/service-unavailable.error';

function getDomainError (err: DatabaseError): Error {
  if (err.code != null) {
    if (err.code === '23505') {
      return new ObjectAlreadyExistsError();
    }
    if (err.code === '22P02') {
      return new InvalidArgumentError(err.routine);
    }
  }
  return new ServiceUnavailableError();
}

export default {
  getDomainError
};
