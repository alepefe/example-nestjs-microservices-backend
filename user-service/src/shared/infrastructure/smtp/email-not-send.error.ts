export class EmailNotSentError extends Error {
  constructor (message = 'Email Server Error') {
    super(`Email not sent: ${message}`);
    this.name = 'EmailNotSentError';
  }
}
