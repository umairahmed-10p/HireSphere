import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const totalJobs = await this.prisma.job.count();
    const jobs = await this.prisma.job.findMany({
      skip,
      take: limit,
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
    });

    return {
      jobs,
      total: totalJobs,
      page,
      totalPages: Math.ceil(totalJobs / limit),
    };
  }

  async findById(id: string) {
    return this.prisma.job.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        applications: true,
      },
    });
  }
}
