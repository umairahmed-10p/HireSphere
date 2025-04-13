import { Controller, Get, Post, Body, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Job, Prisma } from '@prisma/client';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request as ExpressRequest } from 'express';

// Extend Request type to include user
interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  }
}

@Controller('api/dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  async getDashboardStats() {
    // Calculate time to hire
    const completedApplications = await this.dashboardService.prisma.jobApplication.findMany({
      where: { 
        status: 'OFFERED',
        job: {
          status: 'CLOSED'
        }
      },
      include: { 
        job: true 
      }
    });

    const timeToHireCalculations = completedApplications.map(app => {
      const applicationDate = new Date(app.createdAt);
      const hireDate = new Date(app.updatedAt);
      return (hireDate.getTime() - applicationDate.getTime()) / (1000 * 3600 * 24); // days
    });

    const averageTimeToHire = timeToHireCalculations.length > 0 
      ? Math.round(timeToHireCalculations.reduce((a, b) => a + b, 0) / timeToHireCalculations.length)
      : 0;

    // Count open roles
    const openRoles = await this.dashboardService.prisma.job.count({
      where: { status: 'OPEN' }
    });

    // Count active candidates
    const activeCandidates = await this.dashboardService.prisma.jobApplication.count({
      where: { 
        status: {
          in: ['APPLIED', 'INTERVIEWED', 'OFFERED']
        }
      }
    });

    // Count offers
    const offersSent = await this.dashboardService.prisma.jobApplication.aggregate({
      _count: {
        id: true
      },
      where: { 
        status: 'OFFERED'
      }
    });

    const offersAccepted = await this.dashboardService.prisma.jobApplication.count({
      where: { 
        status: 'OFFERED'
      }
    });

    return {
      timeToHire: averageTimeToHire,
      openRoles,
      activeCandidates,
      offersSent: {
        total: offersSent._count.id,
        accepted: offersAccepted,
        pending: offersSent._count.id - offersAccepted
      }
    };
  }

  @Get('timestats')
  async getTimingStats() {
    // Calculate time to hire
    const completedApplications = await this.dashboardService.prisma.jobApplication.findMany({
      where: { 
        status: 'OFFERED',
        job: {
          status: 'CLOSED'
        }
      },
      include: { 
        job: true 
      }
    });

    const timeToHireCalculations = completedApplications.map(app => {
      const applicationDate = new Date(app.createdAt);
      const hireDate = new Date(app.updatedAt);
      return (hireDate.getTime() - applicationDate.getTime()) / (1000 * 3600 * 24); // days
    });

    return {
      timeToHire: completedApplications
    };
  }

  @Post('/jobs')
  @UseGuards(AuthGuard)
  async createJob(@Body() jobData: Partial<Job>, @Req() req: AuthenticatedRequest) {
    try {
      // Ensure job data is valid
      if (!jobData.title || !jobData.description) {
        throw new BadRequestException('Title and description are required')
      }

      // Validate and sanitize input
      const createData: Prisma.JobUncheckedCreateInput = {
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
        userId: jobData.userId || req.user?.id || 'system-user-id', // Fallback to system user
        
        // Ensure dates are handled correctly
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Create the job
      const createdJob = await this.dashboardService.createJob(createData)

      return createdJob
    } catch (error) {
      // Handle different types of errors
      if (error instanceof BadRequestException) {
        throw error
      }
      
      console.error('Error creating job:', error)
      throw new InternalServerErrorException('Failed to create job')
    }
  }
}
