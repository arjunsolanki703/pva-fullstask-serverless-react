import { Test, TestingModule } from '@nestjs/testing';
import { TellabotApiController } from './tellabot-api.controller';

describe('TellabotApiController', () => {
  let controller: TellabotApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TellabotApiController],
    }).compile();

    controller = module.get<TellabotApiController>(TellabotApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
