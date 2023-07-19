import StringUtils from '../../application/string.utils';
import { Criteria } from '../../domain/criteria/criteria';
import { Filter } from '../../domain/criteria/filter';
import { Order } from '../../domain/criteria/order';

export interface CriteriaOpts {
    tableAlias?: string
    filterString?: string
    currentFilterIdx?: number
    sqlParams?: any[]
}

function criteriaToSQL(
    criteria: Criteria,
    opts?: CriteriaOpts
): [sqlParams: any[], filterString: string, orderString: string, limitString: string] {
    const { sqlParams = [], tableAlias } = opts || {};
    let { filterString = '', currentFilterIdx = 1 } = opts || {};
    
    if (criteria.hasFilters()) {
        filterString = filterString ? filterString : 'WHERE ';
        for (const f of criteria.filters) {
            const [whereClause, value] = SQLCriteriaAdapter.convertFilterToSQL(f, currentFilterIdx, tableAlias);
            filterString += `${whereClause} AND `;
            sqlParams.push(value);
            currentFilterIdx += 1;
        }
    }
    filterString = filterString.slice(0, -4);

    let orderString = '';
    if (criteria.order != null) {
        orderString += 'ORDER BY ';
        for (const o of criteria.order) {
            orderString += SQLCriteriaAdapter.convertOrderToSQL(o, tableAlias);
        }
    }

    let limitString = `LIMIT ${criteria.limit}`;
    if (criteria.offset != null) {
        limitString += ` OFFSET ${criteria.offset}`;
    }

    return [sqlParams, filterString, orderString, limitString];
}

function convertFilterToSQL(filter: Filter, currentParamIdx: number, tableAlias?: string): [whereClause: string, value: any] {
    if (typeof filter.value === 'string') {
        return [`${tableAlias ? tableAlias + '.' : ''}${StringUtils.camelToSnake(filter.field)} ${filter.operator.value} $${currentParamIdx}`, filter.value];
    } else if (typeof filter.value === 'number') {
        return [`${tableAlias ? tableAlias + '.' : ''}${StringUtils.camelToSnake(filter.field)} ${filter.operator.value} $${currentParamIdx}`, filter.value];
    }
    throw new Error('filter value type not implemented');
}

function convertOrderToSQL(order: Order, tableAlias?: string): string {
    return `${tableAlias ? tableAlias + '.' : ''}${StringUtils.camelToSnake(order.orderBy)} ${order.orderType}`;
}

const SQLCriteriaAdapter = {
    convertOrderToSQL,
    convertFilterToSQL,
    criteriaToSQL
} as const;

export default SQLCriteriaAdapter;