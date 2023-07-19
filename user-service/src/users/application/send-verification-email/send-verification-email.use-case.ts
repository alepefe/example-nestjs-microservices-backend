import { Injectable } from '@nestjs/common';
import { Logger } from '../../../shared/domain/logger';
import { DomainRequestContext } from '../../../shared/domain/request-context';
import { UseCase } from '../../../shared/domain/use-case';
import { UserRepository } from '../../domain/user.repository';
import { SendVerificationEmailParams } from './send-verification-email.params';
import { EmailSender } from '../../../shared/domain/email-sender';
import { USER_ROLES } from '../../../shared/domain/constants/user-roles.constant';
import { AuthorizationError } from '../../../shared/domain/authorization.error';
import { VERIFICATION_CODE_TYPES } from '../../domain/verification-code/verification_code_types.constant';
import { VerificationCodeType } from '../../domain/verification-code/verification-code-type.value-object';
import { TooManyVerificationCodesSentError } from '../../domain/verification-code/too-many-verification-codes-sent.error';
import { VerificationCode } from '../../domain/verification-code/verification-code';
import { ExpiresAt } from '../../../shared/domain/value-objects/expires-at.value-object';
import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { EmailRecepients } from '../../../shared/domain/email-template/email-recepients';
import { Email } from '../../../shared/domain/email/email';
import { EmailAlreadyVerifiedError } from '../../domain/email-already-verified.error';
import VerificationEmailEmailTemplate from '../../domain/email-template/verification.email-template';

@Injectable()
export class SendVerificationEmailUseCase implements UseCase {
    constructor(
        private readonly logger: Logger,
        private readonly userRepository: UserRepository,
        private readonly emailSender: EmailSender
    ) { }

    private canSendVerificationEmail(params: SendVerificationEmailParams, ctx: DomainRequestContext): boolean {
        if (ctx.auth.authenticatedUserId == null) return false;
        if (ctx.auth.authenticatedUserRoles?.includes(USER_ROLES.ADMIN)) return true;
        if (ctx.auth.authenticatedUserId.equals(params.userId)) return true;
        return false;
    }

    public async run(params: SendVerificationEmailParams, ctx: DomainRequestContext): Promise<void> {
        if (!this.canSendVerificationEmail(params, ctx)) throw new AuthorizationError();

        try {
            const user = await this.userRepository.findUserPrimitivesById(params.userId);
            if (user.emailVerified === true) throw new EmailAlreadyVerifiedError();

            const type = new VerificationCodeType(VERIFICATION_CODE_TYPES.EMAIL);
            const verificationCodes = await this.userRepository.verificationCodesSentInLastInterval(params.userId, type, '24 hours');
            if (!ctx.auth.authenticatedUserRoles?.includes(USER_ROLES.ADMIN) && verificationCodes.length > 4) throw new TooManyVerificationCodesSentError();

            const verificationCode = VerificationCode.createRandom({
                userId: params.userId,
                type,
                expiresAt: new ExpiresAt(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)) // 24 hours from now
            });

            const from = new EmailAddress(process.env.SENDER_EMAIL);
            const to = new EmailRecepients(user.email);
            const emailTemplate = VerificationEmailEmailTemplate.factory({ from, to, code: verificationCode.code });
            const email = Email.fromTemplate(emailTemplate);

            await this.emailSender.send(email);
            await this.userRepository.createVerificationCode(verificationCode);
        } catch (err: any) {
            this.logger.error(err, ctx);
            throw err;
        }
    }
}