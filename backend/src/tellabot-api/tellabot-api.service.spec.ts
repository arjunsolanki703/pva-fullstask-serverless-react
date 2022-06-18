import { Test, TestingModule } from '@nestjs/testing';
import { TellabotApiService } from './tellabot-api.service';

describe('TellabotApiService', () => {
  let service: TellabotApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TellabotApiService],
    }).compile();

    service = module.get<TellabotApiService>(TellabotApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
