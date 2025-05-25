import { Module } from '@nestjs/common';
import { UbungController } from './ubung.controller';
import { UbungService } from './ubung.service';

@Module({
  controllers: [UbungController],
  providers: [UbungService]
})
export class UbungModule {}
