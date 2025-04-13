import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Job, Prisma } from '@prisma/client';
import { ApplicationStatus, JobStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) {}

  // Expose Prisma client for use in controller
  get prisma() {
    return this.prismaService.prisma;
  }

  async getDashboardStats() {
    // Calculate time to hire
    const completedApplications = await this.prisma.jobApplication.findMany({
      where: { 
        status: ApplicationStatus.OFFERED,
        job: {
          status: JobStatus.FILLED
        }
      },
      include: { 
        job: true 
      }
    });


    const timeToHireCalculations = completedApplications.map(app => {
      const applicationDate = new Date(app.createdAt);
      const hireDate = new Date(app.updatedAt);
      const daysToHire = (hireDate.getTime() - applicationDate.getTime()) / (1000 * 3600 * 24);
      return daysToHire;
    });

    const averageTimeToHire = timeToHireCalculations.length > 0 
      ? Math.round(timeToHireCalculations.reduce((a, b) => a + b, 0) / timeToHireCalculations.length)
      : 0;
    

    // Count open roles
    const openRoles = await this.prisma.job.count({
      where: { status: JobStatus.OPEN }
    });

    // Count active candidates
    const activeCandidates = await this.prisma.jobApplication.count({
      where: { 
        status: {
          in: [
            ApplicationStatus.APPLIED,
            ApplicationStatus.INTERVIEWED,
            ApplicationStatus.OFFERED
          ]
        }
      }
    });

    // Count offers
    const offersSent = await this.prisma.jobApplication.aggregate({
      _count: {
        id: true
      },
      where: { 
        status: ApplicationStatus.OFFERED
      }
    });

    const offersAccepted = await this.prisma.jobApplication.count({
      where: { 
        status: ApplicationStatus.OFFERED,
        job: {
          status: JobStatus.FILLED
        }
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

  async createJob(jobData: Prisma.JobUncheckedCreateInput): Promise<Job> {
    try {
      // Validate required fields
      if (!jobData.title || !jobData.description) {
        throw new Error('Title and description are required')
      }

      // Create the job
      const createdJob = await this.prisma.job.create({
        data: jobData
      });

      return createdJob;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }
}
