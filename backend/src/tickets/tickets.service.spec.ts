import { Test, TestingModule } from '@nestjs/testing';

import { TicketApiService } from './tickets.service';

describe('TicketApiService', () => {
  let service: TicketApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketApiService],
    }).compile();

    service = module.get<TicketApiService>(TicketApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
