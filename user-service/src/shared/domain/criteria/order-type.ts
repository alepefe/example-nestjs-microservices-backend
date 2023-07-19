import { InvalidArgumentError } from '../invalid-argument.error';
import { EnumValueObject } from '../value-objects/enum.value-object';

export const ORDER_TYPES = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

export type OrderTypeType = typeof ORDER_TYPES[keyof typeof ORDER_TYPES]

export class OrderType extends EnumValueObject<OrderTypeType> {
  constructor (value: OrderTypeType) {
    super(value, Object.values(ORDER_TYPES));
  }

  static fromValue (value: string): OrderType {
    switch (value) {
      case ORDER_TYPES.ASC:
        return new OrderType(ORDER_TYPES.ASC);
      case ORDER_TYPES.DESC:
        return new OrderType(ORDER_TYPES.DESC);
      default:
        throw new InvalidArgumentError(`The order type ${value} is invalid`);
    }
  }

  protected throwErrorForInvalidValue (value: OrderTypeType): void {
    throw new InvalidArgumentError(`The order type ${value} is invalid`);
  }
}
