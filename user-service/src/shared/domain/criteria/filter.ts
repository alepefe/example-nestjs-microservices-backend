import { InvalidArgumentError } from '../invalid-argument.error';
import { OperatorType, FilterOperator } from './filter-operator';

export interface FilterPrimitives {
  field: string
  operator: OperatorType
  value: any
}

export class Filter {
  public field: string;
  readonly operator: FilterOperator;
  readonly value: any;

  private constructor (field: string, operator: FilterOperator, value: any) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  static fromValues (field: string, operator: string, value: any): Filter {
    if (field === '' || operator === '' || value === '') {
      throw new InvalidArgumentError('Invalid filter');
    }

    return new Filter(field, FilterOperator.fromValue(operator), value);
  }
}
