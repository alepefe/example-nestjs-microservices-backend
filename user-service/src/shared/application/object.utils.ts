import { AggregateRoot } from '../domain/agreggate-root';
import StringUtils from './string.utils';

function isAggregateRoot (obj: any): obj is AggregateRoot<any> {
  return obj instanceof AggregateRoot;
}

function filterProperties<T> (obj: any, propertiesToRemove: string[]): T | Partial<T> & { toPrimitives: () => any } {
  if (!isAggregateRoot(obj)) {
    for (const field of propertiesToRemove) {
      if (field in obj) {
        obj[field] = undefined;
      }
    }
  } else {
    for (const field of propertiesToRemove) {
      if (field in obj.props) {
        obj.props[field] = undefined;
      }
    }
  }
  return obj;
}

function toSnakeCaseKeys<T = any > (obj: any): T {
  const newObject: any = {};

  for (const key of Object.keys(obj)) {
    newObject[StringUtils.camelToSnake(key)] = obj[key];
  }

  return newObject;
}

function toCamelCaseKeys<T = any > (obj: any): T {
  const newObject: any = {};

  for (const key of Object.keys(obj)) {
    newObject[StringUtils.snakeToCamel(key)] = obj[key];
  }

  return newObject;
}

const ObjectUtils = {
  filterProperties,
  toSnakeCaseKeys,
  toCamelCaseKeys
} as const;

export default ObjectUtils;
