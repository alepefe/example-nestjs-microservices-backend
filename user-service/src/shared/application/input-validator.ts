import { InputErrorType } from './input-error.type';

class UserInputError extends Error {
  constructor(
    public name: string,
    public message: string,
    public key: string
  ) {super(message);}
}

function validateUseCaseParam(obj: any, key: string): any {
  try {
    if (obj[key].isList !== true) {
      if(obj[key].Class != null) {
        if(obj[key].method != null) {
          return obj[key].Class[obj[key].method](obj[key].value);
        }
        return new obj[key].Class(obj[key].value);
      }
      return obj[key].value;
    } else {
      return obj[key].value.map(
        (e: unknown) => {
          if(obj[key].class != null) {
            if(obj[key].method != null) {
              return obj[key].Class[obj[key].method](e);
            }
            return new obj[key].Class(e);
          }
          return e;
        },
      );
    }
  } catch(err: any) {
    throw new UserInputError(err.name, err.message, key);
  }
}

function validateUseCaseParams<T>(
  obj: Record<string, { Class?: any; method?: string, value: any; isList?: boolean }>,
): [InputErrorType[], T] {
  const errors: InputErrorType[] = [];
  const params: T = {} as unknown as T;

  for (const key of Object.keys(obj)) {
    try {
      if (obj[key] != null) { (params as any)[key] = validateUseCaseParam(obj, key); }
    } catch (err: any) {
      errors.push({
        name: err.name,
        message: err.message,
        key: err.key,
      });
    }
  }

  return [errors, params];
}

const InputValidator = {
  validateUseCaseParams,
} as const;

export default InputValidator;
