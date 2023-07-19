import { AggregateRoot } from '../../shared/domain/agreggate-root';
import { CreatedAt } from '../../shared/domain/value-objects/created-at.value-object';
import { DeviceId } from '../../shared/domain/value-objects/device-id.value-object';
import { LastModified } from '../../shared/domain/value-objects/last-modifed.value-object';
import { UserId } from '../../shared/domain/value-objects/user-id.value-object';
import { ValueObject } from '../../shared/domain/value-objects/value-object';

export interface DeviceAttrsPrimitives {
  fcmToken?: string;
}

export class DeviceAttrs extends ValueObject {
  private readonly values: DeviceAttrsPrimitives;

  private constructor(values: DeviceAttrsPrimitives) {
    super();
    this.values = values;
  }

  public static fromPrimitives(rawData: DeviceAttrsPrimitives): DeviceAttrs {
    return new DeviceAttrs({
      fcmToken: rawData.fcmToken,
    });
  }

  public toPrimitives(): DeviceAttrsPrimitives {
    return {
      fcmToken: this.values.fcmToken,
    };
  }
}

export interface DevicePrimitives {
  deviceId: string;
  userId: string;
  name: string;
  userAgent: string;
  attrs?: DeviceAttrsPrimitives;
  lastModified: Date;
  createdAt: Date;
}

export interface DeviceProps {
  deviceId: DeviceId;
  userId: UserId;
  name: string;
  userAgent: string;
  attrs?: DeviceAttrs;
  lastModified: LastModified;
  createdAt: CreatedAt;
}

export type CreateDeviceParams = Omit<
  DeviceProps,
  'createdAt' | 'lastModified'
>;

export class Device extends AggregateRoot<DeviceProps> {
  private constructor(props: DeviceProps) {
    super(props);
  }

  public get deviceId(): DeviceId {
    return this.props.deviceId;
  }
  public get userId(): UserId {
    return this.props.userId;
  }
  public get name(): string {
    return this.props.name;
  }
  public get userAgent(): string {
    return this.props.userAgent;
  }
  public get attrs(): DeviceAttrs | undefined {
    return this.props.attrs;
  }
  public get lastModified(): LastModified {
    return this.props.lastModified;
  }
  public get createdAt(): CreatedAt {
    return this.props.createdAt;
  }

  public updateAttrs(attrs: any): void {
    this.props.attrs = attrs;
    this.props.lastModified = new LastModified();
  }

  public static create(props: CreateDeviceParams): Device {
    const date = new Date();

    const lastModified = new LastModified(date);
    const createdAt = new CreatedAt(date);
    return new Device({
      ...props,
      lastModified,
      createdAt,
    });
  }

  public static fromPrimitives(rawData: DevicePrimitives): Device {
    return new Device({
      deviceId: new DeviceId(rawData.deviceId),
      userId: new UserId(rawData.userId),
      name: rawData.name,
      userAgent: rawData.userAgent,
      attrs:
        rawData.attrs != null
          ? DeviceAttrs.fromPrimitives(rawData.attrs)
          : undefined,
      lastModified: new LastModified(rawData.lastModified),
      createdAt: new CreatedAt(rawData.createdAt),
    });
  }

  public toPrimitives(): DevicePrimitives {
    return {
      deviceId: this.props.deviceId.toString(),
      userId: this.props.userId.toString(),
      name: this.props.name,
      userAgent: this.props.userAgent,
      attrs:
        this.props.attrs != null ? this.props.attrs.toPrimitives() : undefined,
      lastModified: this.props.lastModified.value,
      createdAt: this.props.createdAt.value,
    };
  }
}
