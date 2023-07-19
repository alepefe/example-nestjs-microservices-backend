export interface ExpectedEnvVariables {
    USER_POSTGRES_HOST: string,
    USER_POSTGRES_PORT: string,
    USER_POSTGRES_USER: string,
    USER_POSTGRES_PASSWORD: string,
    USER_SMTP_HOST: string,
    USER_SMTP_PORT: string,
    USER_SMTP_USER: string,
    USER_SMTP_PASSWORD: string
}

const validateEnvVariables = (variables: ExpectedEnvVariables) => {
    if (typeof variables.USER_POSTGRES_HOST !== 'string' || variables.USER_POSTGRES_HOST.length < 8) {
        throw new Error('USER_POSTGRES_HOST not properly set');
    }

    if (typeof variables.USER_POSTGRES_PORT !== 'string' || variables.USER_POSTGRES_PORT.length != 4) {
        throw new Error('USER_POSTGRES_PORT not properly set');
    }

    if (typeof variables.USER_POSTGRES_USER !== 'string') {
        throw new Error('USER_POSTGRES_USER not properly set');
    }

    if (typeof variables.USER_POSTGRES_PASSWORD !== 'string') {
        throw new Error('USER_POSTGRES_PASSWORD not properly set');
    }

    if (typeof variables.USER_SMTP_HOST !== 'string') {
        throw new Error('USER_SMTP_HOST not properly set');
    }

    if (typeof variables.USER_SMTP_PORT !== 'string') {
        throw new Error('USER_SMTP_PORT not properly set');
    }

    if (typeof variables.USER_SMTP_USER !== 'string') {
        throw new Error('USER_SMTP_USER not properly set');
    }

    if (typeof variables.USER_SMTP_PASSWORD !== 'string') {
        throw new Error('USER_SMTP_PASSWORD not properly set');
    }

    return variables;
};

export default validateEnvVariables;