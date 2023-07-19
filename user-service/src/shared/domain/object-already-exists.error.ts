export class ObjectAlreadyExistsError extends Error {
  constructor(message = '') {
    super(message);
  }
}
