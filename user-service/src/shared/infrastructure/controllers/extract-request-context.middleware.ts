import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestWitDomainRequestContext } from './request-with-context';
import { DomainRequestContext } from '../../domain/request-context';
import { UserRoleType } from '../../domain/constants/user-roles.constant';

@Injectable()
export class ExtractRequestContextMiddleware implements NestMiddleware {
    public use(req: RequestWitDomainRequestContext, res: Response, next: NextFunction) {
        req.domainRequestContext = DomainRequestContext.fromPrimitives({
            request: {
                id: req.headers['x-request-id'] as string,
                ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'] as string,
                country: req.headers['cf-ipcountry'] as string,
                method: req.method,
                path: req.path,
            },
            auth: {
                authenticatedUserId: req.headers['x-authenticated-user-id'] as string,
                authenticatedUserRoles: (req.headers['x-authenticated-user-roles'] as string)?.split(',') as UserRoleType[],
                deviceId: req.headers['x-device-id'] as string
            }
        });
        next();
    }
}