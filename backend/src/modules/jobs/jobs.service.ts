import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
  
    const totalJobs = await this.prisma.job.count({
      where: {
        user: {
          role: 'CANDIDATE',
        },
      },
    });
  
    const jobs = await this.prisma.job.findMany({
      skip,
      take: limit,
      where: {
        user: {
          role: 'CANDIDATE',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    return {
      jobs: jobs.map(job => ({
        ...job,
        numberOfApplicants: job._count.applications,
      })),
      total: totalJobs,
      page,
      totalPages: Math.ceil(totalJobs / limit),
    };
  }

  async findById(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        applications: {
          where: {
            user: {
              role: 'CANDIDATE'
            }
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      },
    });

    if (!job) return null;

    return {
      ...job,
      numberOfApplicants: job.applications.length,
    };
  }

  async create(createJobDto: any) {
    return this.prisma.job.create({
      data: {
        ...createJobDto,
        status: createJobDto.status || 'OPEN',
      },
    });
  }

  async update(id: string, updateJobDto: any) {
    const existingJob = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return this.prisma.job.update({
      where: { id },
      data: updateJobDto,
    });
  }

  async updateJob(jobId: string, updateData: Prisma.JobUncheckedUpdateInput): Promise<any> {
    try {
      // Verify job exists
      const existingJob = await this.prisma.job.findUnique({
        where: { id: jobId }
      })

      if (!existingJob) {
        throw new NotFoundException(`Job with ID ${jobId} not found`)
      }

      // Perform update
      const updatedJob = await this.prisma.job.update({
        where: { id: jobId },
        data: updateData
      })

      return updatedJob
    } catch (error) {
      // Log the error for debugging
      console.error('Error in updateJob service method:', error)

      // Rethrow or handle specific error types
      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to update job')
    }
  }

  async delete(id: string) {
    const existingJob = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return this.prisma.job.delete({
      where: { id },
    });
  }
}
