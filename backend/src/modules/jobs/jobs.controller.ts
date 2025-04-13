import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Prisma } from '@prisma/client';
import { Job } from '@prisma/client';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(
    @Param('page') page = 1, 
    @Param('limit') limit = 10
  ) {
    return this.jobsService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const job = await this.jobsService.findById(id);
      
      if (!job) {
        throw new BadRequestException('Job not found');
      }
      
      return job;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw new InternalServerErrorException('Failed to fetch job');
    }
  }

  @Post()
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Put(':id')
  async updateJob(
    @Param('id') jobId: string, 
    @Body() jobData: Partial<Job>
  ): Promise<Job> {
    try {
      // Validate required fields
      if (!jobData.title || !jobData.description) {
        throw new BadRequestException('Title and description are required')
      }

      // Validate and sanitize input
      const updateData: Prisma.JobUncheckedUpdateInput = {
        title: jobData.title,
        description: jobData.description,
        department: jobData.department || 'Unspecified',
        location: jobData.location || 'Remote',
        salary: jobData.salary || 0,
        status: jobData.status || 'OPEN',
        team: jobData.team || 'General',
        
        // Ensure these are always arrays
        jobOverview: Array.isArray(jobData.jobOverview) 
          ? jobData.jobOverview.filter(item => item && item.trim() !== '') 
          : [],
        responsibilities: Array.isArray(jobData.responsibilities) 
          ? jobData.responsibilities.filter(item => item && item.trim() !== '') 
          : [],
        
        // Optional fields
        company: jobData.company || 'Unspecified Company',
        hiringManager: jobData.hiringManager || 'Unassigned',
        userId: jobData.userId || 'system-user-id',
        
        // Update timestamps
        updatedAt: new Date()
      }

      // Update the job
      const updatedJob = await this.jobsService.updateJob(jobId, updateData)

      return updatedJob
    } catch (error) {
      // Handle different types of errors
      if (error instanceof BadRequestException) {
        throw error
      }
      
      console.error('Error updating job:', error)
      throw new InternalServerErrorException('Failed to update job')
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.jobsService.delete(id);
  }
}
