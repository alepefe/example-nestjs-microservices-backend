import { Test, TestingModule } from '@nestjs/testing';
import { FindUserController } from './find-user.controller';

describe('FindUserController', () => {
  let controller: FindUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindUserController],
    }).compile();

    controller = module.get<FindUserController>(FindUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
