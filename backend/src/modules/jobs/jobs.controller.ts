import { 
  Controller, 
  Get, 
  Param, 
  Query 
} from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(
    @Query('page') page = 1, 
    @Query('limit') limit = 10
  ) {
    return this.jobsService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }
}
