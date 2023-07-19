import { AggregateRoot } from '../../../shared/domain/agreggate-root';
import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';
import { Active } from '../../../shared/domain/value-objects/active.value-object';
import { CreatedAt } from '../../../shared/domain/value-objects/created-at.value-object';
import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { LastModified } from '../../../shared/domain/value-objects/last-modifed.value-object';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import { AuthStrategyType } from './auth-strategies.constant';
import { AuthStrategyName } from './auth-strategy-name.value-object';
import { AuthStrategyProviderId } from './auth-strategy-provider-id.value-object';
import { Password } from './password.value-object';

export interface AuthStrategyPrimitives {
  userId: string
  email: string
  name: AuthStrategyType
  active: boolean
  providerId?: string
  password?: string
  lastModified: Date
  createdAt: Date
}

export interface AuthStrategyProps {
  userId: UserId
  email: EmailAddress
  name: AuthStrategyName
  active: Active
  providerId?: AuthStrategyProviderId
  password?: Password
  lastModified: LastModified
  createdAt: CreatedAt
}

export class AuthStrategy extends AggregateRoot<AuthStrategyProps> {
  public static MUST_REMOVE_FIELDS = ['providerId', 'password'];
  public static SENSITIVE_FIELDS = [...AuthStrategy.MUST_REMOVE_FIELDS, 'lastModified', 'createdAt'];

  public get userId (): UserId { return this.props.userId; }
  public get name (): AuthStrategyName { return this.props.name; }
  public get email (): EmailAddress { return this.props.email; }
  public get active (): Active { return this.props.active; }
  public get providerId (): AuthStrategyProviderId | undefined { return this.props.providerId; }
  public get password (): Password | undefined { return this.props.password; }
  public get lastModified (): LastModified { return this.props.lastModified; }
  public get createdAt (): CreatedAt { return this.props.createdAt; }

  public static create (params: Omit<AuthStrategyProps, 'lastModified' | 'createdAt'>): AuthStrategy {
    switch (params.name.value as AuthStrategyType) {
      case 'local':
        if (params.password == null) throw new InvalidArgumentError('password missing for local strategy');
        break;

      case 'google_id_token':
        if (params.providerId == null) throw new InvalidArgumentError('providerId missing for google_id_token strategy');
        break;

      case 'google_access_token':
        if (params.providerId == null) throw new InvalidArgumentError('providerId missing for google_id_token strategy');
        break;

      default:
        throw new InvalidArgumentError('invalid authStrategyName');
    }

    const date = new Date();
    const lastModified = new LastModified(date);
    const createdAt = new CreatedAt(date);

    return new AuthStrategy({
      userId: params.userId,
      email: params.email,
      name: params.name,
      active: params.active,
      providerId: params.providerId,
      password: params.password,
      lastModified,
      createdAt
    });
  }

  public static fromPrimitives (rawData: AuthStrategyPrimitives): AuthStrategy {
    return new AuthStrategy({
      userId: new UserId(rawData.userId),
      email: new EmailAddress(rawData.email),
      name: new AuthStrategyName(rawData.name),
      active: new Active(rawData.active),
      providerId: (rawData.providerId != null) ? new AuthStrategyProviderId(rawData.providerId) : undefined,
      password: (rawData.password != null) ? new Password(rawData.password) : undefined,
      lastModified: new LastModified(rawData.lastModified),
      createdAt: new CreatedAt(rawData.createdAt)
    });
  }

  public toPrimitives (): AuthStrategyPrimitives {
    return {
      userId: this.props.userId.toString(),
      email: this.props.email.value,
      name: this.props.name.value as AuthStrategyType,
      active: this.props.active.value,
      providerId: this.props.providerId?.value,
      password: this.props.password?.value,
      lastModified: this.props.lastModified.value,
      createdAt: this.props.createdAt.value
    };
  }
}
