import { 
  Controller, 
  Get, 
  Param, 
  NotFoundException, 
  Patch, 
  Body, 
  BadRequestException,
  HttpException,
  HttpStatus,
  Post,
  Delete
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { InterviewType, Interview, InterviewStatus, User, JobApplication, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface CreateInterviewDto {
  candidateId: string;
  jobApplicationId?: string;
  interviewers: string[];
  interviewType: InterviewType;
  scheduledDate: string;
  duration?: number;
  notes?: string;
}

// Custom type to make jobApplication optional
type InterviewCreateInputWithOptionalJobApplication = Omit<Prisma.InterviewCreateInput, 'jobApplication'> & {
  jobApplication?: Prisma.JobApplicationCreateNestedOneWithoutInterviewsInput;
};

@Controller('interviews')
export class InterviewsController {
  constructor(
    private readonly interviewsService: InterviewsService,
    private readonly prisma: PrismaService
  ) {}

  @Get()
  async findAll() {
    return this.interviewsService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const interview = await this.prisma.interview.findUnique({
  //     where: { id }
  //   });
    
  //   if (!interview) {
  //     throw new NotFoundException(`Interview with ID ${id} not found`);
  //   }
    
  //   return interview;
  // }

  @Patch(':id/rating')
  async updateRating(
    @Param('id') id: string, 
    @Body('rating') rating: number
  ) {
    if (rating < 0 || rating > 5) {
      throw new BadRequestException('Rating must be between 0 and 5');
    }

    const updatedInterview = await this.prisma.interview.update({
      where: { id },
      data: { rating }
    });

    if (!updatedInterview) {
      throw new NotFoundException(`Interview with ID ${id} not found`);
    }

    return updatedInterview;
  }

  @Patch(':id')
  async updateInterview(
    @Param('id') id: string,
    @Body() updateData: Partial<Interview>
  ) {
    const updatedInterview = await this.prisma.interview.update({
      where: { id },
      data: updateData
    });

    return updatedInterview;
  }

  @Delete(':id')
  async deleteInterview(@Param('id') id: string) {
    const deletedInterview = await this.prisma.interview.delete({
      where: { id }
    });

    return deletedInterview;
  }

  @Get()
  async getAllInterviews() {
    try {
      const interviews = await this.prisma.interview.findMany({
        include: {
          candidate: true,
          jobApplication: {
            include: {
              job: true
            }
          },
        },
        orderBy: {
          scheduledDate: 'desc'
        }
      });

      return interviews;
    } catch (error) {
      console.error('Error fetching interviews:', error);
      throw new HttpException('Failed to fetch interviews', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  async getInterviewById(@Param('id') id: string) {
    try {
      const interview = await this.prisma.interview.findUnique({
        where: { id },
        include: {
          candidate: {
            select: {
              id: true,
              name: true
            }
          },
          jobApplication: {
            include: {
              job: true,
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      if (!interview) {
        throw new HttpException('Interview not found', HttpStatus.NOT_FOUND);
      }

      // Fetch interviewer details separately
      const interviewerDetails = await this.prisma.user.findMany({
        where: { 
          id: { in: interview.interviewers },
          role: 'EMPLOYER'
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      });

      return {
        ...interview,
        interviewerDetails
      };
    } catch (error) {
      console.error('Error fetching interview:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to fetch interview', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createInterview(@Body() interviewData: CreateInterviewDto): Promise<Interview> {
    try {
      console.log('Received interview data:', JSON.stringify(interviewData, null, 2));

      // Validate interviewers exist
      const interviewerNames = interviewData.interviewers || [];
      if (interviewerNames.length === 0) {
        throw new HttpException('At least one interviewer is required', HttpStatus.BAD_REQUEST);
      }

      console.log('Interviewer names:', interviewerNames);

      // Validate candidate exists
      const candidate = await this.prisma.user.findUnique({
        where: { id: interviewData.candidateId, role: 'CANDIDATE' }
      });

      if (!candidate) {
        throw new HttpException('Candidate not found', HttpStatus.NOT_FOUND);
      }

      // Optional: Validate job application if provided
      let jobApplication: JobApplication | null = null;
      if (interviewData.jobApplicationId) {
        console.log(`Searching for job application: ${interviewData.jobApplicationId}`);
        jobApplication = await this.prisma.jobApplication.findFirst({
          where: { 
            id: interviewData.jobApplicationId,
            userId: candidate.id 
          }
        });

        if (!jobApplication) {
          console.error(`Job Application not found: ${interviewData.jobApplicationId}`);
          throw new HttpException('Job Application not found or does not belong to the candidate', HttpStatus.NOT_FOUND);
        }
        console.log('Found job application:', JSON.stringify(jobApplication, null, 2));
      }

      // Prepare create input - directly use interviewer names
      const createInput = {
        candidate: { 
          connect: { id: candidate.id } 
        },
        interviewers: interviewerNames, // Directly save interviewer names
        interviewType: interviewData.interviewType,
        scheduledDate: new Date(interviewData.scheduledDate),
        duration: interviewData.duration,
        notes: interviewData.notes,
        ...(jobApplication ? { 
          jobApplication: { 
            connect: { id: jobApplication.id } 
          } 
        } : {})
      } as Prisma.InterviewCreateInput;

      console.log('Create input:', JSON.stringify(createInput, null, 2));

      // Create interview
      const newInterview = await this.prisma.interview.create({
        data: createInput
      });

      console.log('Created interview:', JSON.stringify(newInterview, null, 2));
      console.log('Interviewer names saved:', newInterview.interviewers);

      return newInterview;
    } catch (error) {
      // Log the error for debugging
      console.error('Interview creation error:', error);
      throw error;
    }
  }
}
