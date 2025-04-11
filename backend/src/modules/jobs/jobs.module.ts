import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, PrismaService],
  exports: [JobsService],
})
export class JobsModule {}
