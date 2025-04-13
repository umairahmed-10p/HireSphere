import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  // Expose Prisma client
  get prisma() {
    return this._prisma;
  }

  async onModuleInit() {
    await this._prisma.$connect();
  }

  async onModuleDestroy() {
    await this._prisma.$disconnect();
  }
}
