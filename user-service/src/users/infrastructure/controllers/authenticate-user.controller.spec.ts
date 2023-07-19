import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticateController } from './authenticate-user.controller';
import { UserRepository } from '../../domain/user-repository';
import { AuthenticateUserUseCase } from '../../application/authenticate-user/authenticate-user.use-case';
import { MockUserRepository } from '../persistence/__mocks__/MockUserRepository';

describe('AuthenticateController', () => {
  let controller: AuthenticateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticateController],
      providers: [
        { provide: UserRepository, useClass: MockUserRepository },
        AuthenticateUserUseCase,
      ],
    }).compile();

    controller = module.get<AuthenticateController>(AuthenticateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
