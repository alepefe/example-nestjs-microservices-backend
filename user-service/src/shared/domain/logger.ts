/* eslint-disable @typescript-eslint/no-unused-vars */
import { DomainRequestContext } from './request-context';

export interface ILogger {
    info(msg: string, ctx?: DomainRequestContext): void
    debug(msg: string, ctx?: DomainRequestContext): void
    error(error: any, ctx?: DomainRequestContext): void
}

export abstract class Logger implements ILogger {
    public info(msg: string, ctx?: DomainRequestContext): void {
        throw new Error('Not implemented.');
    }

    public debug(msg: string, ctx?: DomainRequestContext): void {
        throw new Error('Not implemented.');
    }

    public error(error: any, ctx?: DomainRequestContext): void {
        throw new Error('Not implemented.');
    }
}