import { Pool } from 'pg';

const PostgresUserPool = {
    provide: 'POSTGRES_USER_POOL',
    useFactory:  (): Pool => {
        return new Pool({
            host: process.env.USER_POSTGRES_HOST,
            port: parseInt(process.env.USER_POSTGRES_PORT),
            database: 'app',
            user: process.env.USER_POSTGRES_USER,
            password: process.env.USER_POSTGRES_PASSWORD
        });
    }
};

export default PostgresUserPool;