import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestWitDomainRequestContext } from './request-with-context';
import { Logger } from '../../domain/logger';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
    constructor(
        private readonly logger: Logger
    ) {}

    public use(req: RequestWitDomainRequestContext, res: Response, next: NextFunction) {
        res.on('finish', () => {
            req.domainRequestContext.response = { statusCode: res.statusCode };
            this.logger.info('info', req.domainRequestContext);
        });

        next();
    }
}