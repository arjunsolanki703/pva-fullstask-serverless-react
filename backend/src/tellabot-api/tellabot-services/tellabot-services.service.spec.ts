import { Test, TestingModule } from '@nestjs/testing';
import { TellabotServicesService } from './tellabot-services.service';

describe('TellabotServicesService', () => {
  let service: TellabotServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TellabotServicesService],
    }).compile();

    service = module.get<TellabotServicesService>(TellabotServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
