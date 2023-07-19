import { DomainRequestContext } from '../domain/request-context';
import { ILogger } from '../domain/logger';
import pino from 'pino';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PinoLogger implements ILogger {
    private readonly logger: pino.Logger;

    constructor() {
        this.logger = pino({
            base: {
                pid: undefined
            },
            formatters: {
                level: (label: string) => {
                  return { severity: label };
                },
                log: (obj: any) => {
                  return obj;
                }
            }
        });
    }

    public debug(msg: string, ctx?: DomainRequestContext): void {
        this.logger.debug({ msg, ctx: ctx?.toPrimitives() });
    }

    public info(msg: string, ctx?: DomainRequestContext): void {
        this.logger.info({ msg, ctx: ctx?.toPrimitives() });
    }

    public error(error: any, ctx?: DomainRequestContext): void {
        this.logger.error({ error: { msg: error.message, name: error.constructor.name, }, ctx: ctx?.toPrimitives() });
    }

}