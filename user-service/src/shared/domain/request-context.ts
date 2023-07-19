import { DomainRequestContextAuth, RequestContextAuth } from './request-context-auth';
import { ObjectValueObject } from './value-objects/object.value-object';

export interface HTTPRequest {
  id: string
  method: string
  path: string
  ip: string | string[]
  userAgent: string
  country: string
}

export interface HTTPResponse {
  statusCode: number
}
export interface RequestContext {
  request: HTTPRequest
  response?: HTTPResponse
  auth: RequestContextAuth
}

export interface DomainRequestContextType {
  request: HTTPRequest
  response?: HTTPResponse
  auth: DomainRequestContextAuth
}

export class DomainRequestContext extends ObjectValueObject<DomainRequestContextType> {
  private constructor (value: DomainRequestContextType) {
    super(value);
  }

  public get request(): HTTPRequest { return this.value.request; }
  public get response(): HTTPResponse | undefined { return this.value.response; }
  public get auth (): DomainRequestContextAuth { return this.value.auth; }


  public set response(res: HTTPResponse | undefined) {
    this.value.response = res;
  }

  public toPrimitives (): RequestContext {
    return {
      request: this.value.request,
      response: this.value.response,
      auth: this.value.auth.toPrimitives()
    };
  }

  public static fromPrimitives (data: RequestContext): DomainRequestContext {
    return new DomainRequestContext({
      request: data.request,
      response: data.response,
      auth: DomainRequestContextAuth.fromPrimitives(data.auth)
    });
  }
}
