import { Test, TestingModule } from '@nestjs/testing';
import { TellabotServicesController } from './tellabot-services.controller';

describe('TellabotServicesController', () => {
  let controller: TellabotServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TellabotServicesController],
    }).compile();

    controller = module.get<TellabotServicesController>(TellabotServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
