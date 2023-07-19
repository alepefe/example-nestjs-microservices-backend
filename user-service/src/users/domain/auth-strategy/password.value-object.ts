import { pbkdf2 } from 'pbkdf2';
import { ValueObject } from '../../../shared/domain/value-objects/value-object';
import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';

export class Password extends ValueObject {
  readonly value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  public static fromString(value: string): Password {
    if (value == null || value === '' || value.length < 6) throw new InvalidArgumentError('password not valid');
    return new Password(value);
  }

  public toString(): string {
    return this.value;
  }

  public static async getHashedPassword(value: string): Promise<Password> {
    const hashedPassword = await new Promise<string>((resolve) => {
      pbkdf2(value, 'salt', 1, 32, 'sha512', (err: any, buffer: Buffer) => {
        if (err != null) throw err;
        resolve(buffer.toString('hex'));
      });
    });
    return new Password(hashedPassword);
  }

  public async verify(password: Password): Promise<boolean> {
    const hashedPassword = await new Promise<string>((resolve) => {
      pbkdf2(
        password.value,
        'salt',
        1,
        32,
        'sha512',
        (err: any, buffer: Buffer) => {
          if (err != null) throw err;
          resolve(buffer.toString('hex'));
        },
      );
    });
    if (this.value !== hashedPassword) return false;
    return true;
  }
}
