import { Test, TestingModule } from '@nestjs/testing';
import { UbungService } from './ubung.service';

describe('UbungService', () => {
  let service: UbungService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UbungService],
    }).compile();

    service = module.get<UbungService>(UbungService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
