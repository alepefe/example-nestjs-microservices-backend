import { Order, OrderPrimitives } from './order';
import { Filter, FilterPrimitives } from './filter';
import { InvalidArgumentError } from '../invalid-argument.error';

export interface CriteriaPrimitives {
  searchString?: string
  filters?: FilterPrimitives[]
  order?: OrderPrimitives[]
  limit: number
  offset?: number
}
interface CriteriaProps {
  searchString?: string
  filters?: Filter[]
  order?: Order[]
  limit: number
  offset?: number
}

export class Criteria {
  private readonly props: CriteriaProps;

  get filters (): Filter[] | undefined { return this.props.filters; }
  get order (): Order[] | undefined { return this.props.order; }
  get limit (): number { return this.props.limit; }
  get offset (): number | undefined { return this.props.offset; }

  private constructor (props: CriteriaProps) {
    this.props = props;
  }

  public hasFilters (): this is { filters: Filter[] } {
    return this.filters != null && this.filters.length > 0;
  }

  public static fromPrimitives (criteriaPrimitives: CriteriaPrimitives): Criteria {
    if (criteriaPrimitives.limit == null) throw new InvalidArgumentError('limit is not defined');

    const searchString = criteriaPrimitives.searchString;
    const filters = criteriaPrimitives.filters?.map(cp => Filter.fromValues(cp.field, cp.operator, cp.value));
    const order = criteriaPrimitives.order?.map(o => Order.fromValues(o.orderBy, o.orderType));
    const limit = criteriaPrimitives.limit;
    const offset = criteriaPrimitives.offset;
    return new Criteria({ searchString, filters, order, limit, offset });
  }
}
