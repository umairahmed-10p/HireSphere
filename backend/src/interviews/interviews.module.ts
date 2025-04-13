import { Module } from '@nestjs/common';
import { InterviewsService } from '../interviews/interviews.service';
import { InterviewsController } from '../interviews/interviews.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [InterviewsController],
  providers: [InterviewsService, PrismaService],
})
export class InterviewsModule {}
