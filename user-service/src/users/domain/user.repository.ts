/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeviceId } from '../../shared/domain/value-objects/device-id.value-object';
import { EmailAddress } from '../../shared/domain/value-objects/email-address.value-object';
import { UserId } from '../../shared/domain/value-objects/user-id.value-object';
import { AuthStrategy } from './auth-strategy/auth-strategy.value-object';
import { Password } from './auth-strategy/password.value-object';
import { Device } from './device';
import { User, UserPrimitives } from './user';
import { VerificationCode, VerificationCodePrimitives } from './verification-code/verification-code';
import { VerificationCodeCode } from './verification-code/verification-code-code.value-object';
import { VerificationCodeType } from './verification-code/verification-code-type.value-object';

export interface IUserRepository {
  connect(): Promise<void>
  disconnect(): Promise<void> 

  createUser(user: User): Promise<void>
  updateUser (user: User): Promise<void>
  deleteUser(user: User): Promise<void>
  updateUserPassword (userId: UserId, password: Password): Promise<void>

  findUserPrimitivesById(userId: UserId): Promise<UserPrimitives>
  findUserById(userId: UserId): Promise<User>
  findUserWithAuthStrategiesById (userId: UserId): Promise<User>

  findUserByEmail(email: EmailAddress): Promise<User>
  findUserWithAuthStrategiesByEmail(email: EmailAddress): Promise<User>

  searchUsersPrimitives(): Promise<UserPrimitives[]>
  searchUsers(): Promise<User>

  createUserDevice(device: Device): Promise<void>
  findUserDevice(userId: UserId, deviceId: DeviceId): Promise<Device>
  updateUserDevice(device: Device): Promise<void>
  deleteUserDevice(userId: UserId, deviceId: DeviceId): Promise<void>

  createVerificationCode(verificationCode: VerificationCode): Promise<void>
  findVerificationCode(userId: UserId, type: VerificationCodeType, code: VerificationCodeCode): Promise<VerificationCode>
  deleteVerificationCode(verificationCode: VerificationCode): Promise<void>
  verificationCodesSentInLastInterval (userId: UserId, type: VerificationCodeType, interval: string): Promise<VerificationCodePrimitives[]>
  deleteVerificationCodes(userId: UserId, type: VerificationCodeType): Promise<void>
}
export abstract class UserRepository implements IUserRepository {
  connect(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  disconnect(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  createUser(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateUser(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteUser(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateUserPassword(userId: UserId, password: Password): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findUserPrimitivesById(userId: UserId): Promise<UserPrimitives> {
    throw new Error('Method not implemented.');
  }
  findUserById(userId: UserId): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findUserWithAuthStrategiesById(userId: UserId): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findUserByEmail(email: EmailAddress): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findUserWithAuthStrategiesByEmail(email: EmailAddress): Promise<User> {
    throw new Error('Method not implemented.');
  }
  searchUsersPrimitives(): Promise<UserPrimitives[]> {
    throw new Error('Method not implemented.');
  }
  searchUsers(): Promise<User> {
    throw new Error('Method not implemented.');
  }
  createUserDevice(device: Device): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findUserDevice(userId: UserId, deviceId: DeviceId): Promise<Device> {
    throw new Error('Method not implemented.');
  }
  updateUserDevice(device: Device): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteUserDevice(userId: UserId, deviceId: DeviceId): Promise<void> {
    throw new Error('Method not implemented.');
  }
  createVerificationCode(verificationCode: VerificationCode): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findVerificationCode(userId: UserId, type: VerificationCodeType, code: VerificationCodeCode): Promise<VerificationCode> {
    throw new Error('Method not implemented.');
  }
  deleteVerificationCode(verificationCode: VerificationCode): Promise<void> {
    throw new Error('Method not implemented.');
  }
  verificationCodesSentInLastInterval(userId: UserId, type: VerificationCodeType, interval: string): Promise<VerificationCodePrimitives[]> {
    throw new Error('Method not implemented.');
  }
  deleteVerificationCodes(userId: UserId, type: VerificationCodeType): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
