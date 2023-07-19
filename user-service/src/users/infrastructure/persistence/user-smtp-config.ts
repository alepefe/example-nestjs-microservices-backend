import { SMTPConfig } from '../../../shared/infrastructure/smtp/smtp-config';

const UserSMTPConfig = {
    provide: 'USER_SMTP_CONFIG',
    useFactory:  (): SMTPConfig => {
        return {
            host: process.env.USER_SMTP_HOST,
            port: parseInt(process.env.USER_SMTP_PORT),
            user: process.env.USER_SMTP_USER,
            password: process.env.USER_SMTP_PASSWORD,
        };
    }
};

export default UserSMTPConfig;