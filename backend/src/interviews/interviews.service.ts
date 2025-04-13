import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.interview.findMany({
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        jobApplication: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.interview.findUnique({
      where: { id },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        jobApplication: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
  }

  async updateRating(id: string, rating: number) {
    // First, check if the interview exists
    const existingInterview = await this.prisma.interview.findUnique({
      where: { id }
    })

    if (!existingInterview) {
      return null
    }

    // Update the interview with the new rating
    return this.prisma.interview.update({
      where: { id },
      data: { 
        rating,
        status: 'COMPLETED' // Ensure status is set to completed when rating is added
      },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        jobApplication: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
  }
}
