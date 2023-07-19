import { InvalidArgumentError } from '../invalid-argument.error';
import { EnumValueObject } from '../value-objects/enum.value-object';

export const Operators = {
  EQUAL: '=',
  NOT_EQUAL: '!=',
  GT: '>',
  LT: '<',
  IN: 'IN',
  NOT_IN: 'NOT IN',
  SIMILARITY: '<->',
  ILIKE: 'ilike',
  MODULUS: '%'
} as const;

export type OperatorType = typeof Operators[keyof typeof Operators]

export class FilterOperator extends EnumValueObject<OperatorType> {
  constructor (value: OperatorType) {
    super(value, Object.values(Operators));
  }

  static fromValue (value: string): FilterOperator {
    switch (value) {
      case Operators.EQUAL:
        return new FilterOperator(Operators.EQUAL);
      case Operators.NOT_EQUAL:
        return new FilterOperator(Operators.NOT_EQUAL);
      case Operators.GT:
        return new FilterOperator(Operators.GT);
      case Operators.LT:
        return new FilterOperator(Operators.LT);
      case Operators.IN:
        return new FilterOperator(Operators.IN);
      case Operators.NOT_IN:
        return new FilterOperator(Operators.NOT_IN);
      case Operators.MODULUS:
        return new FilterOperator(Operators.MODULUS);
      case Operators.ILIKE:
        return new FilterOperator(Operators.ILIKE);
      case Operators.SIMILARITY:
        return new FilterOperator(Operators.SIMILARITY);
      default:
        throw new InvalidArgumentError(`The filter Operators ${value} is invalid`);
    }
  }

  protected throwErrorForInvalidValue (value: OperatorType): void {
    throw new InvalidArgumentError(`The filter Operators ${value} is invalid`);
  }
}
