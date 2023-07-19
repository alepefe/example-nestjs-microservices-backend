import { Request } from 'express';
import { DomainRequestContext } from '../../domain/request-context';

export interface RequestWitDomainRequestContext extends Request {
    domainRequestContext: DomainRequestContext
}