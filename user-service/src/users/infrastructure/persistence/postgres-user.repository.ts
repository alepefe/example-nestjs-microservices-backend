import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository';
import { User, UserPrimitives } from '../../domain/user';
import { Pool, DatabaseError, PoolClient } from 'pg';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import { ObjectNotFoundError } from '../../../shared/domain/object-not-found.error';
import { Logger } from '../../../shared/domain/logger';
import PostgresErrorMapping from '../../../shared/infrastructure/persistence/PostgresErrorMapping';
import { DeviceId } from '../../../shared/domain/value-objects/device-id.value-object';
import { Device } from '../../domain/device';
import ObjectUtils from '../../../shared/application/object.utils';
import { VerificationCode, VerificationCodePrimitives } from '../../domain/verification-code/verification-code';
import { VerificationCodeCode } from '../../domain/verification-code/verification-code-code.value-object';
import { VerificationCodeType } from '../../domain/verification-code/verification-code-type.value-object';
import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { Password } from '../../domain/auth-strategy/password.value-object';
import { AuthStrategy } from '../../domain/auth-strategy/auth-strategy.value-object';
import { DatabaseError as DomainDatabaseError } from '../../../shared/infrastructure/persistence/database.error';

@Injectable()
export class PostgresUserRepository implements IUserRepository {

  constructor(
    private readonly logger: Logger,
    @Inject('POSTGRES_USER_POOL')
    private readonly pool: Pool
  ) { }

  public async connect(): Promise<void> {
    const conn = await this.pool.connect();
    conn.release();
  }
  public async disconnect(): Promise<void> {
    await this.pool.end();
  }

  public async updateUserPassword(userId: UserId, password: Password): Promise<void> {
    const query = {
      text: `
        UPDATE user_auth_strategies SET password = $2 WHERE name = 'local' AND user_id = $1
      `,
      values: [
        userId.toString(),
        password.toString()
      ]
    };

    try {
      await this.pool.query(query);
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async createVerificationCode(verificationCode: VerificationCode): Promise<void> {
    const query = {
      text: `
        INSERT INTO user_verification_codes (user_id, type, code, expires_at, created_at) VALUES ($1, $2, $3, $4, $5)
      `,
      values: [
        verificationCode.userId.toString(),
        verificationCode.type.value,
        verificationCode.code.value,
        verificationCode.expiresAt.toUTCString(),
        verificationCode.createdAt.toUTCString()
      ]
    };

    try {
      await this.pool.query(query);
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async findVerificationCode(userId: UserId, type: VerificationCodeType, code: VerificationCodeCode): Promise<VerificationCode> {
    const query = {
      text: `SELECT user_id as "userId", type, code, expires_at as "expiresAt", created_at as "createdAt"
      FROM user_verification_codes WHERE user_id = $1 AND type = $2 AND code = $3`,
      values: [userId.toString(), type.value, code.value]
    };
    try {
      const res = await this.pool.query(query);
      if (res.rows.length > 0) {
        return VerificationCode.fromPrimitives(res.rows[0]);
      }
      throw new ObjectNotFoundError();
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }
  public async deleteVerificationCode(verificationCode: VerificationCode): Promise<void> {
    const query = {
      text: 'DELETE FROM user_verification_codes WHERE user_id = $1 AND type = $2 AND code = $3',
      values: [
        verificationCode.userId.toString(),
        verificationCode.type.value,
        verificationCode.code.toString()
      ]
    };

    try {
      await this.pool.query(query);
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async verificationCodesSentInLastInterval(userId: UserId, type: VerificationCodeType, interval: string): Promise<VerificationCodePrimitives[]> {
    const query = {
      text: `SELECT user_id as "userId", type, code, expires_at as "expiresAt", created_at as "createdAt"
      FROM user_verification_codes WHERE user_id = $1 AND type = $2 AND created_at >= NOW() - ($3)::INTERVAL`,
      values: [userId.toString(), type.value, interval]
    };
    try {
      const res = await this.pool.query(query);
      if (res.rows.length > 0) {
        return res.rows;
      }
      return [];
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async deleteVerificationCodes(userId: UserId, type: VerificationCodeType): Promise<void> {
    const query = {
      text: 'DELETE FROM user_verification_codes WHERE user_id = $1 AND type = $2',
      values: [
        userId.toString(),
        type.value
      ]
    };

    try {
      await this.pool.query(query);
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async createUser(user: User): Promise<void> {
    const query = {
      text: `
          INSERT INTO users (id, active, email_verified, email, name, surname, phone, roles, last_modified, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
      values: [
        user.id.toString(),
        user.active.value,
        user.emailVerified.value,
        user.email.value,
        user.name?.value,
        user.surname?.value,
        user.phone?.value,
        user.roles.map(r => r.value),
        user.lastModified.toUTCString(),
        user.createdAt.toUTCString()
      ]
    };

    if (user.authStrategies == null || user.authStrategies.length === 0) throw new DomainDatabaseError();

    const authStrategy: AuthStrategy = user.authStrategies[0];
    const authStrategyQuery = {
      text: `INSERT INTO user_auth_strategies (user_id, email, name, active, provider_id, password, last_modified, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      values: [
        authStrategy.userId.toString(),
        authStrategy.email.value,
        authStrategy.name.value,
        authStrategy.active.value,
        authStrategy.providerId?.value,
        authStrategy.password?.toString(),
        authStrategy.lastModified.toUTCString(),
        authStrategy.createdAt.toUTCString()
      ]
    };

    let client!: PoolClient;
    try {
      client = await this.pool.connect();
      await client.query('BEGIN');
      await client.query(query);
      await client.query(authStrategyQuery);
      await client.query('COMMIT');
    } catch (err: any) {
      await client.query('ROLLBACK');
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    } finally {
      client.release();
    }
  }

  public async updateUser(user: User): Promise<void> {
    const query = {
      text: `
        UPDATE users SET name = $2, surname = $3, active = $4, email = $5, email_verified = $6, 
        phone = $7, roles = $8, last_modified = $9 WHERE id = $1
      `,
      values: [
        user.id.toString(),
        user.name?.value,
        user.surname?.value,
        user.active.value,
        user.email.value,
        user.emailVerified.value,
        user.phone?.value,
        user.roles.map(r => r.value),
        user.lastModified.toUTCString()
      ]
    };

    try {
      await this.pool.query(query);
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async findUserPrimitivesById(userId: UserId): Promise<UserPrimitives> {
    const query = {
      text: `
        SELECT id, active, email_verified as "emailVerified", email, name, surname, phone, roles, 
        last_modified as "lastModified", created_at as "createdAt" FROM users WHERE id = $1
      `,
      values: [userId.toString()]
    };
    try {
      const res = await this.pool.query(query);
      if (res.rows.length > 0) {
        return res.rows[0];
      }
      throw new ObjectNotFoundError();
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async findUserById(userId: UserId): Promise<User> {
    return User.fromPrimitives(await this.findUserPrimitivesById(userId));
  }

  public async findUserByEmail(email: EmailAddress): Promise<User> {
    const query = {
      text: `
        SELECT id, active, email_verified as "emailVerified", email, name, surname, phone,
        roles, last_modified as "lastModified", created_at as "createdAt" FROM users WHERE email = $1
      `,
      values: [email.toString()]
    };
    try {
      const res = await this.pool.query(query);
      if (res.rows.length > 0) {
        return User.fromPrimitives(res.rows[0]);
      }
      throw new ObjectNotFoundError();
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async findUserWithAuthStrategiesByEmail(email: EmailAddress): Promise<User> {
    const query = {
      text: `
        SELECT id, active, email_verified as "emailVerified", email, name, surname, phone, 
        roles, last_modified as "lastModified", created_at as "createdAt",
        (
          SELECT
          json_agg(json_build_object(
            'name', ua.name,
            'userId', ua.user_id,
            'email', ua.email,
            'active', ua.active,
            'providerId', ua.provider_id,
            'password', ua.password,
            'lastModified', ua.last_modified,
            'createdAt', ua.created_at
          ))
          FROM user_auth_strategies ua
          WHERE ua.email = $1
        ) AS "authStrategies" 
        FROM users WHERE email = $1
      `,
      values: [email.value]
    };
    try {
      const res = await this.pool.query(query);
      if (res.rows.length > 0) {
        return User.fromPrimitives(res.rows[0]);
      }
      throw new ObjectNotFoundError();
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async findUserWithAuthStrategiesById(userId: UserId): Promise<User> {
    const query = {
      text: `
        SELECT id, active, email_verified as "emailVerified", email, name, surname, phone, 
        roles, last_modified as "lastModified", created_at as "createdAt",
        (
          SELECT
          json_agg(json_build_object(
            'name', ua.name,
            'userId', ua.user_id,
            'email', ua.email,
            'active', ua.active,
            'providerId', ua.provider_id,
            'password', ua.password,
            'lastModified', ua.last_modified,
            'createdAt', ua.created_at
          ))
          FROM user_auth_strategies ua
          WHERE ua.user_id = $1
        ) AS "authStrategies" 
        FROM users WHERE id = $1
      `,
      values: [userId.toString()]
    };
    try {
      const res = await this.pool.query(query);
      if (res.rows.length > 0) {
        return User.fromPrimitives(res.rows[0]);
      }
      throw new ObjectNotFoundError();
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async searchUsersPrimitives(): Promise<UserPrimitives[]> {
    throw new Error('Method not implemented.');
  }

  public async searchUsers(): Promise<User> {
    throw new Error('Method not implemented.');
  }


  public async deleteUser(user: User): Promise<void> {
    const query = {
      text: 'DELETE FROM users WHERE user_id = $1',
      values: [
        user.id.toString()
      ]
    };

    try {
      await this.pool.query(query);
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async createUserDevice(device: Device): Promise<void> {
    const query = {
      text: `
        INSERT INTO user_auth_devices (user_id, device_id, name, agent, attrs, last_modified, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      values: [
        device.userId.toString(),
        device.deviceId.toString(),
        device.name,
        device.userAgent,
        device.attrs != null ? ObjectUtils.toSnakeCaseKeys(device.attrs.toPrimitives()) : undefined,
        device.lastModified.toUTCString(),
        device.createdAt.toUTCString()
      ]
    };

    try {
      await this.pool.query(query);
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async findUserDevice(userId: UserId, deviceId: DeviceId): Promise<Device> {
    const query = {
      text: `
          SELECT device_id as "deviceId", user_id as "userId", name, agent, attrs,
          last_modified as "lastModified", created_at as "createdAt"
          FROM user_auth_devices WHERE user_id = $1 AND device_id = $2
        `,
      values: [userId.toString(), deviceId.toString()]
    };
    try {
      const res = await this.pool.query(query);
      if (res.rows.length > 0) {
        return Device.fromPrimitives({
          deviceId: res.rows[0].deviceId,
          userId: res.rows[0].userId,
          name: res.rows[0].name,
          userAgent: res.rows[0].agent,
          attrs: res.rows[0].attrs != null
            ? ObjectUtils.toCamelCaseKeys(res.rows[0].attrs)
            : undefined,
          lastModified: res.rows[0].lastModified,
          createdAt: res.rows[0].createdAt
        });
      }
      throw new ObjectNotFoundError();
    } catch (err: any) {
      this.logger.error(err);
      if (err instanceof DatabaseError) {
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async updateUserDevice(device: Device): Promise<void> {
    const query = {
      text: 'UPDATE user_auth_devices SET attrs = $3 WHERE user_id = $1 AND device_id = $2',
      values: [
        device.userId.toString(),
        device.deviceId.toString(),
        ObjectUtils.toSnakeCaseKeys(device.attrs?.toPrimitives())
      ]
    };

    try {
      await this.pool.query(query);
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }

  public async deleteUserDevice(userId: UserId, deviceId: DeviceId): Promise<void> {
    const query = {
      text: 'DELETE FROM user_auth_devices WHERE user_id = $1 AND device_id = $2',
      values: [
        userId.toString(),
        deviceId.toString()
      ]
    };

    try {
      await this.pool.query(query);
    } catch (err: any) {
      if (err instanceof DatabaseError) {
        this.logger.error(err);
        throw PostgresErrorMapping.getDomainError(err);
      }
      throw err;
    }
  }
}
