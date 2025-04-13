import { Module } from '@nestjs/common';
import { CandidatesController } from './candidates.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CandidatesController],
})
export class CandidatesModule {}
