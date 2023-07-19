import { AggregateRoot } from '../../shared/domain/agreggate-root';
import { UserRoleType } from '../../shared/domain/constants/user-roles.constant';
import { Active } from '../../shared/domain/value-objects/active.value-object';
import { CreatedAt } from '../../shared/domain/value-objects/created-at.value-object';
import { EmailAddress } from '../../shared/domain/value-objects/email-address.value-object';
import { LastModified } from '../../shared/domain/value-objects/last-modifed.value-object';
import { Phone } from '../../shared/domain/value-objects/phone.value-object';
import { UserId } from '../../shared/domain/value-objects/user-id.value-object';
import { UserRole } from '../../shared/domain/value-objects/user-role.value-object';
import { AuthStrategy, AuthStrategyPrimitives } from './auth-strategy/auth-strategy.value-object';
import { EmailVerified } from './email-verified.value-object';
import { Name } from './name.value-object';
import { Surname } from './surname.value-object';

export interface UserPrimitives {
  id: string
  email: string
  active: boolean
  emailVerified: boolean
  name?: string
  surname?: string
  phone?: string
  roles: UserRoleType[]
  authStrategies?: AuthStrategyPrimitives[]
  lastModified: Date
  createdAt: Date
}

export interface UserProps {
  id: UserId
  email: EmailAddress
  active: Active
  emailVerified: EmailVerified
  name?: Name
  surname?: Surname
  phone?: Phone
  roles: UserRole[]
  authStrategies?: AuthStrategy[]
  lastModified: LastModified
  createdAt: CreatedAt
}

export class User extends AggregateRoot<UserProps> {
  public static MUST_REMOVE_FIELDS = ['password', 'providerId'];
  public static SENSITIVE_FIELDS = ['lastModified', 'password', 'providerId', 'emailVerified'];

  private constructor(props: UserProps) {
    super(props);
  }

  public get id(): UserId {
    return this.props.id;
  }

  public get email(): EmailAddress {
    return this.props.email;
  }

  public get active(): Active {
    return this.props.active;
  }

  public get emailVerified(): EmailVerified {
    return this.props.emailVerified;
  }

  public get name(): Name | undefined {
    return this.props.name;
  }

  public get surname(): Surname | undefined {
    return this.props.surname;
  }

  public get phone(): Phone | undefined {
    return this.props.phone;
  }

  public get roles(): UserRole[] {
    return this.props.roles;
  }

  public get authStrategies(): AuthStrategy[] | undefined {
    return this.props.authStrategies;
  }

  public get lastModified(): LastModified {
    return this.props.lastModified;
  }

  public get createdAt(): CreatedAt {
    return this.props.createdAt;
  }

  public static create(params: Omit<UserProps, 'createdAt' | 'lastModified'>): User {
    const date = new Date();

    const lastModified = new LastModified(date);
    const createdAt = new CreatedAt(date);
    return new User({
      ...params,
      lastModified,
      createdAt
    });
  }

  public update (params: Partial<UserProps>): void {
    for (const key of Object.keys(params)) {
      (this.props as any)[key] = (params as any)[key];
    }
    this.props.lastModified = new LastModified();
  }

  public static fromPrimitives(rawData: UserPrimitives): User {
    return new User({
      id: new UserId(rawData.id),
      email: new EmailAddress(rawData.email),
      active: new Active(rawData.active),
      emailVerified: new EmailVerified(rawData.emailVerified),
      name: rawData.name ? new Name(rawData.name):undefined,
      surname: rawData.surname ? new Surname(rawData.surname):undefined,
      phone: rawData.phone ? new Phone(rawData.phone) : undefined,
      roles: rawData.roles.map((r) => new UserRole(r)),
      authStrategies: rawData.authStrategies?.map(s => AuthStrategy.fromPrimitives(s)),
      lastModified: new LastModified(rawData.lastModified),
      createdAt: new CreatedAt(rawData.createdAt),
    });
  }

  public toPrimitives(): UserPrimitives {
    return {
      id: this.props.id.toString(),
      email: this.props.email.value,
      active: this.props.active.value,
      emailVerified: this.props.emailVerified.value,
      name: this.props.name?.value,
      surname: this.props.surname?.value,
      phone: this.props.phone?.value,
      roles: this.props.roles.map((r) => r.value as UserRoleType),
      authStrategies: this.props.authStrategies?.map(s => s.toPrimitives()),
      lastModified: this.props.lastModified.value,
      createdAt: this.props.createdAt.value,
    };
  }
}
