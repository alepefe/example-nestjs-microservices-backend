import { UserRoleType } from './constants/user-roles.constant';
import { DeviceId } from './value-objects/device-id.value-object';
import { ObjectValueObject } from './value-objects/object.value-object';
import { UserId } from './value-objects/user-id.value-object';


export interface RequestContextAuth {
  authenticatedUserId?: string
  authenticatedUserRoles?: UserRoleType[]
  deviceId: string
}

export interface DomainRequestContextAuthType {
  authenticatedUserId?: UserId
  authenticatedUserRoles?: UserRoleType[]
  deviceId: DeviceId
}

export class DomainRequestContextAuth extends ObjectValueObject<DomainRequestContextAuthType> {
  private constructor (value: DomainRequestContextAuthType) {
    super(value);
  }

  get authenticatedUserId (): UserId | undefined { return this.value.authenticatedUserId; }
  get authenticatedUserRoles (): UserRoleType[] | undefined { return this.value.authenticatedUserRoles; }
  get deviceId (): DeviceId { return this.value.deviceId; }
  set deviceId (deviceId: DeviceId) { this.value.deviceId = deviceId; }

  public static fromPrimitives (data: RequestContextAuth): DomainRequestContextAuth {
    const params: any = {};

    if (data.authenticatedUserId != null) {
      params.authenticatedUserId = new UserId(data.authenticatedUserId);
    }
    if (data.authenticatedUserRoles != null) {
      params.authenticatedUserRoles = data.authenticatedUserRoles;
    }

    if (data.deviceId != null) {
      params.deviceId = new DeviceId(data.deviceId);
    }

    return new DomainRequestContextAuth(params);
  }

  public toPrimitives (): RequestContextAuth {
    return {
      authenticatedUserId: this.value.authenticatedUserId?.toString(),
      authenticatedUserRoles: this.value.authenticatedUserRoles,
      deviceId: this.value.deviceId?.toString(),
    };
  }
}