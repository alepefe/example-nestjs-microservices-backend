import { AggregateRoot } from '../../../shared/domain/agreggate-root';
import { CreatedAt } from '../../../shared/domain/value-objects/created-at.value-object';
import { ExpiresAt } from '../../../shared/domain/value-objects/expires-at.value-object';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import { VerificationCodeCode } from './verification-code-code.value-object';
import { VerificationCodeType } from './verification-code-type.value-object';
import { VerificationCodeTypeType } from './verification_code_types.constant';

export interface VerificationCodePrimitives {
  userId: string
  type: string
  code: string
  expiresAt: Date
  createdAt: Date
}

export interface VerificationProps {
  userId: UserId
  type: VerificationCodeType
  code: VerificationCodeCode
  expiresAt: ExpiresAt
  createdAt: CreatedAt
}

export interface CreateRandomParams {
  userId: UserId
  type: VerificationCodeType
  expiresAt: ExpiresAt
}

export class VerificationCode extends AggregateRoot<VerificationProps> {
  public get userId (): UserId { return this.props.userId; }
  public get type (): VerificationCodeType { return this.props.type; }
  public get code (): VerificationCodeCode { return this.props.code; }
  public get expiresAt (): ExpiresAt { return this.props.expiresAt; }
  public get createdAt (): CreatedAt { return this.props.createdAt; }

  public isExpired (): boolean {
    return this.props.expiresAt.value <= new Date();
  }

  public static createRandom (params: CreateRandomParams): VerificationCode {
    const code = VerificationCodeCode.generate6DigitCode();
    const createdAt = new CreatedAt();

    return new VerificationCode({ ...params, createdAt, code });
  }

  public static fromPrimitives (rawData: VerificationCodePrimitives): VerificationCode {
    return new VerificationCode({
      userId: new UserId(rawData.userId),
      type: new VerificationCodeType(rawData.type as VerificationCodeTypeType),
      code: new VerificationCodeCode(rawData.code),
      expiresAt: new ExpiresAt(rawData.expiresAt),
      createdAt: new CreatedAt(rawData.createdAt)
    });
  }

  public toPrimitives (): VerificationCodePrimitives {
    return {
      userId: this.props.userId.value,
      type: this.props.type.value,
      code: this.props.code.value,
      expiresAt: this.props.expiresAt.value,
      createdAt: this.props.createdAt.value
    };
  }
}
