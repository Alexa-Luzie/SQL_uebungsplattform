// src/prisma/prisma.service.ts

import { INestApplication, Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  private _submission: any;
  public get submission(): any {
    return this._submission;
  }
  public set submission(value: any) {
    this._submission = value;
  }
  async enableShutdownHooks(app: INestApplication) {
    // @ts-ignore
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}