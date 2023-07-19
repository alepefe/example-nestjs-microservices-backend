import { OrderType, type OrderTypeType } from './order-type';

export interface OrderPrimitives {
  orderBy: string
  orderType: OrderTypeType
}

export class Order {
  readonly orderBy: string;
  readonly orderType: OrderType;

  constructor (orderBy: string, orderType: OrderType) {
    this.orderBy = orderBy;
    this.orderType = orderType;
  }

  static fromValues (orderBy: string, orderType: string): Order {
    return new Order(orderBy, OrderType.fromValue(orderType));
  }
}
