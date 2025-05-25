import { Test, TestingModule } from '@nestjs/testing';
import { UbungController } from './ubung.controller';

describe('UbungController', () => {
  let controller: UbungController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UbungController],
    }).compile();

    controller = module.get<UbungController>(UbungController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
