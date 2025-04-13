import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  Query, 
  Body, 
  HttpException, 
  HttpStatus, 
  NotFoundException, 
  Patch 
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User, JobApplication, Interview, InterviewStatus, InterviewType, UserRole, Job } from '@prisma/client';

interface CandidateResponse {
  id: string;
  name: string;
  email: string;
  profile?: {
    skills?: string[] | null;
    location?: string | null;
    bio?: string | null;
  };
  applications: Array<{
    id: string;
    job: {
      id: string;
      title: string;
      company: string | null;
    };
    status: JobApplication['status'];
    createdAt: Date;
    interviews: Array<{
      id: string;
      interviewType: InterviewType;
      date: Date;
      status: InterviewStatus;
      notes?: string | null;
      interviewers: string[];
      jobApplication: {
        id: string | null;
        job: {
          id: string;
          title: string | undefined;
          company: string | undefined;
        }
      }
    }>
  }>;
};

interface CandidateInterviewsResponse {
  upcomingInterviews: Array<{
    id: string;
    interviewType: InterviewType;
    date: Date;
    status: InterviewStatus;
    notes: string | null;
    interviewers: string[];
    jobApplication: {
      id: string | null;
      job: {
        id: string;
        title: string | undefined;
        company: string | undefined;
      };
    };
  }>;
  completedInterviews: Array<{
    id: string;
    interviewType: InterviewType;
    date: Date;
    status: InterviewStatus;
    notes: string | null;
    interviewers: string[];
    jobApplication: {
      id: string | null;
      job: {
        id: string;
        title: string | undefined;
        company: string | undefined;
      };
    };
  }>;
};

type EnhancedInterview = Interview & {
  jobApplication?: (JobApplication & {
    job?: Pick<Job, 'id' | 'title' | 'company'>
  })
};

@Controller('candidates')
export class CandidatesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getCandidates(
    @Query('applicationStatus') applicationStatus?: string
  ) {
    try {
      const candidates = await this.prisma.user.findMany({
        where: {
          role: 'CANDIDATE'
        },
        include: {
          applications: {
            where: applicationStatus ? { status: applicationStatus as any } : {},
            include: {
              job: true,
              interviews: true
            },
            take: 1
          },
          profile: true
        }
      });

      return candidates
        .filter(candidate => candidate.applications.length > 0)
        .map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          profile: candidate.profile ? {
            skills: candidate.profile.skills || [],
            location: candidate.profile.location || null,
            bio: candidate.profile.bio || null
          } : undefined,
          applications: candidate.applications.map(app => ({
            id: app.id,
            job: {
              id: app.job.id,
              title: app.job.title || 'Untitled Job',
              company: app.job.company || 'Unnamed Company'
            },
            status: app.status,
            createdAt: app.createdAt,
            interviews: (app.interviews as EnhancedInterview[]).map(interview => ({
              id: interview.id,
              interviewType: interview.interviewType,
              date: interview.scheduledDate,
              status: interview.status,
              notes: interview.notes,
              interviewers: interview.interviewers,
              jobApplication: {
                id: interview.jobApplicationId ?? null,
                job: {
                  id: interview.jobApplication?.job?.id ?? '',
                  title: interview.jobApplication?.job?.title ?? '',
                  company: interview.jobApplication?.job?.company ?? ''
                }
              }
            }))
          }))
        }));
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw new HttpException('Failed to fetch candidates', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('all')
  async getAllCandidates() {
    try {
      const candidates = await this.prisma.user.findMany({
        where: {
          role: 'CANDIDATE'
        },
        include: {
          applications: {
            include: {
              job: true,
              interviews: true
            },
            take: 1
          },
          profile: true
        }
      });

      return candidates.map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        profile: candidate.profile ? {
          skills: candidate.profile.skills || [],
          location: candidate.profile.location || null,
          bio: candidate.profile.bio || null
        } : undefined,
        applications: candidate.applications.map(app => ({
          id: app.id,
          job: {
            id: app.job.id,
            title: app.job.title || 'Untitled Job',
            company: app.job.company || 'Unnamed Company'
          },
          status: app.status,
          createdAt: app.createdAt,
          interviews: (app.interviews as EnhancedInterview[]).map(interview => ({
            id: interview.id,
            interviewType: interview.interviewType,
            date: interview.scheduledDate,
            status: interview.status,
            notes: interview.notes,
            interviewers: interview.interviewers,
            jobApplication: {
              id: interview.jobApplicationId ?? null,
              job: {
                id: interview.jobApplication?.job?.id ?? '',
                title: interview.jobApplication?.job?.title ?? '',
                company: interview.jobApplication?.job?.company ?? ''
              }
            }
          }))
        }))
      }));
    } catch (error) {
      console.error('Error fetching all candidates:', error);
      throw new HttpException('Failed to fetch all candidates', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('employers')
  async getEmployers() {
    try {
      const candidates = await this.prisma.user.findMany({
        where: {
          role: 'EMPLOYER'
        },
        include: {
          profile: true
        }
      });

      return candidates.map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        profile: candidate.profile ? {
          skills: candidate.profile.skills || [],
          location: candidate.profile.location || null,
          bio: candidate.profile.bio || null
        } : undefined,
      }));
    } catch (error) {
      console.error('Error fetching all employers:', error);
      throw new HttpException('Failed to fetch all employers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  async getCandidateById(@Param('id') id: string): Promise<CandidateResponse> {
    try {
      const candidate = await this.prisma.user.findFirst({
        where: { 
          id,
          role: 'CANDIDATE'
        },
        include: {
          applications: {
            include: {
              job: true,
              interviews: true
            }
          },
          profile: true
        }
      });

      if (!candidate) {
        throw new NotFoundException('Candidate not found');
      }

      return {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        profile: candidate.profile ? {
          skills: candidate.profile.skills || [],
          location: candidate.profile.location || null,
          bio: candidate.profile.bio || null
        } : undefined,
        applications: candidate.applications.map(app => ({
          id: app.id,
          job: {
            id: app.job.id,
            title: app.job.title || 'Untitled Job',
            company: app.job.company || 'Unnamed Company'
          },
          status: app.status,
          createdAt: app.createdAt,
          interviews: (app.interviews as EnhancedInterview[]).map(interview => ({
            id: interview.id,
            interviewType: interview.interviewType,
            date: interview.scheduledDate,
            status: interview.status,
            notes: interview.notes,
            interviewers: interview.interviewers,
            jobApplication: {
              id: interview.jobApplicationId ?? null,
              job: {
                id: interview.jobApplication?.job?.id ?? '',
                title: interview.jobApplication?.job?.title ?? '',
                company: interview.jobApplication?.job?.company ?? ''
              }
            }
          }))
        }))
      };
    } catch (error) {
      console.error('Error fetching candidate:', error);
      throw new HttpException('Failed to fetch candidate', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id/interviews')
  async getCandidateInterviews(@Param('id') id: string): Promise<CandidateInterviewsResponse> {
    try {
      const candidate = await this.prisma.user.findFirst({
        where: { id },
        include: {
          applications: {
            include: {
              job: true,
              interviews: true
            }
          }
        }
      });

      if (!candidate) {
        throw new NotFoundException('Candidate not found');
      }

      const upcomingInterviews = candidate.applications.flatMap(app => 
        (app.interviews as EnhancedInterview[]).filter(interview => interview.status === InterviewStatus.UPCOMING)
      );

      const completedInterviews = candidate.applications.flatMap(app => 
        (app.interviews as EnhancedInterview[]).filter(interview => interview.status === InterviewStatus.COMPLETED)
      );

      return {
        upcomingInterviews: upcomingInterviews.map(interview => ({
          id: interview.id,
          interviewType: interview.interviewType,
          date: interview.scheduledDate,
          status: interview.status,
          notes: interview.notes,
          interviewers: interview.interviewers,
          jobApplication: {
            id: interview.jobApplicationId ?? null,
            job: {
              id: interview.jobApplication?.job?.id ?? '',
              title: interview.jobApplication?.job?.title ?? '',
              company: interview.jobApplication?.job?.company ?? ''
            }
          }
        })),
        completedInterviews: completedInterviews.map(interview => ({
          id: interview.id,
          interviewType: interview.interviewType,
          date: interview.scheduledDate,
          status: interview.status,
          notes: interview.notes,
          interviewers: interview.interviewers,
          jobApplication: {
            id: interview.jobApplicationId ?? null,
            job: {
              id: interview.jobApplication?.job?.id ?? '',
              title: interview.jobApplication?.job?.title ?? '',
              company: interview.jobApplication?.job?.company ?? ''
            }
          }
        }))
      };
    } catch (error) {
      console.error('Error fetching candidate interviews:', error);
      throw new HttpException('Failed to fetch candidate interviews', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id/applications')
  async getCandidateApplications(@Param('id') id: string) {
    try {
      const candidate = await this.prisma.user.findFirst({
        where: { id },
        include: {
          applications: {
            include: {
              job: true,
              interviews: true
            }
          }
        }
      });

      if (!candidate) {
        throw new NotFoundException('Candidate not found');
      }

      return candidate.applications.map(app => ({
        id: app.id,
        job: {
          id: app.job.id,
          title: app.job.title || 'Untitled Job',
          company: app.job.company || 'Unnamed Company'
        },
        status: app.status,
        interviews: (app.interviews as EnhancedInterview[]).map(interview => ({
          id: interview.id,
          interviewType: interview.interviewType,
          date: interview.scheduledDate,
          createdAt: app.createdAt,
          status: interview.status,
          notes: interview.notes,
          interviewers: interview.interviewers,
          jobApplication: {
            id: interview.jobApplicationId ?? null,
            job: {
              id: interview.jobApplication?.job?.id ?? '',
              title: interview.jobApplication?.job?.title ?? '',
              company: interview.jobApplication?.job?.company ?? ''
            }
          }
        }))
      }));
    } catch (error) {
      console.error('Error fetching candidate applications:', error);
      throw new HttpException('Failed to fetch candidate applications', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createCandidate(@Body() candidateData: {
    name: string;
    email: string;
    avatar?: string;
    profile?: {
      skills?: string[];
      location?: string;
      bio?: string;
    }
  }): Promise<CandidateResponse> {
    try {
      // Check if a candidate with the same email already exists
      const existingCandidate = await this.prisma.user.findUnique({
        where: { 
          email: candidateData.email,
        }
      });

      if (existingCandidate) {
        throw new HttpException('Candidate with this email already exists', HttpStatus.CONFLICT);
      }

      // Create the new candidate
      const newCandidate = await this.prisma.user.create({
        data: {
          name: candidateData.name,
          email: candidateData.email,
          role: 'CANDIDATE',
          avatar: candidateData.avatar || null,
          password: '', // Default empty password, should be set later
          initials: candidateData.name.slice(0, 2).toUpperCase(),
          isActive: true,
          profile: candidateData.profile ? {
            create: {
              skills: candidateData.profile.skills,
              location: candidateData.profile.location,
              bio: candidateData.profile.bio
            }
          } : undefined
        },
        include: {
          profile: true,
          applications: {
            include: {
              job: true,
              interviews: true
            }
          }
        }
      });

      // Transform the created candidate to match CandidateResponse
      return {
        id: newCandidate.id,
        name: newCandidate.name,
        email: newCandidate.email,
        profile: newCandidate.profile ? {
          skills: newCandidate.profile.skills || [],
          location: newCandidate.profile.location || null,
          bio: newCandidate.profile.bio || null
        } : undefined,
        applications: [] // No applications yet for a new candidate
      };
    } catch (error) {
      console.error('Error creating candidate:', error);
      
      // Handle unique constraint violation for email
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new HttpException('Candidate with this email already exists', HttpStatus.CONFLICT);
      }

      throw new HttpException('Failed to create candidate', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id')
  async updateCandidate(
    @Param('id') id: string,
    @Body() updateData: {
      name?: string;
      email?: string;
      profile?: {
        skills?: string[];
        location?: string | null;
        bio?: string | null;
      }
    }
  ): Promise<CandidateResponse> {
    try {
      // Validate that the candidate exists
      const existingCandidate = await this.prisma.user.findUnique({
        where: { id, role: 'CANDIDATE' }
      })

      if (!existingCandidate) {
        throw new HttpException('Candidate not found', HttpStatus.NOT_FOUND)
      }

      // Check for unique email constraint if email is being updated
      if (updateData.email && updateData.email !== existingCandidate.email) {
        const emailExists = await this.prisma.user.findUnique({
          where: { email: updateData.email }
        })

        if (emailExists) {
          throw new HttpException('Email already in use', HttpStatus.CONFLICT)
        }
      }

      // Update the candidate
      const updatedCandidate = await this.prisma.user.update({
        where: { id },
        data: {
          name: updateData.name,
          email: updateData.email,
          profile: updateData.profile ? {
            update: {
              skills: updateData.profile.skills,
              location: updateData.profile.location,
              bio: updateData.profile.bio
            }
          } : undefined
        },
        include: {
          profile: true,
          applications: {
            include: {
              job: true,
              interviews: true
            }
          }
        }
      })

      // Transform the response to match CandidateResponse type
      return {
        id: updatedCandidate.id,
        name: updatedCandidate.name,
        email: updatedCandidate.email,
        profile: updatedCandidate.profile ? {
          skills: updatedCandidate.profile.skills || [],
          location: updatedCandidate.profile.location || null,
          bio: updatedCandidate.profile.bio || null
        } : undefined,
        applications: updatedCandidate.applications.map(app => ({
          id: app.id,
          tags: app.tags,
          createdAt: app.createdAt,
          job: {
            id: app.job.id,
            title: app.job.title || 'Untitled Job',
            company: app.job.company || 'Unnamed Company'
          },
          status: app.status,
          interviews: (app.interviews as EnhancedInterview[]).map(interview => ({
            id: interview.id,
            interviewType: interview.interviewType,
            date: interview.scheduledDate,
            status: interview.status,
            notes: interview.notes,
            interviewers: interview.interviewers,
            jobApplication: {
              id: interview.jobApplicationId ?? null,
              job: {
                id: interview.jobApplication?.job?.id ?? '',
                title: interview.jobApplication?.job?.title ?? '',
                company: interview.jobApplication?.job?.company ?? ''
              }
            }
          }))
        }))
      }
    } catch (error) {
      console.error('Error updating candidate:', error)

      // Handle unique constraint violation for email
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new HttpException('Candidate with this email already exists', HttpStatus.CONFLICT)
      }

      throw new HttpException('Failed to update candidate', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Patch('/:candidateId/applications/:applicationId/status')
  async updateApplicationStatus(
    @Param('candidateId') candidateId: string,
    @Param('applicationId') applicationId: string,
    @Body('status') status: JobApplication['status']
  ): Promise<CandidateResponse> {
    try {
      // Validate that the candidate exists
      const existingCandidate = await this.prisma.user.findUnique({
        where: { id: candidateId, role: 'CANDIDATE' }
      });

      if (!existingCandidate) {
        throw new NotFoundException('Candidate not found');
      }

      // Validate that the application exists and belongs to the candidate
      const existingApplication = await this.prisma.jobApplication.findFirst({
        where: { 
          id: applicationId, 
          userId: candidateId 
        }
      });

      if (!existingApplication) {
        throw new NotFoundException('Application not found');
      }

      // Update the application status
      const updatedApplication = await this.prisma.jobApplication.update({
        where: { id: applicationId },
        data: { 
          status: status 
        },
        include: {
          job: true,
          interviews: true,
          user: {
            include: {
              profile: true,
              applications: {
                include: {
                  job: true,
                  interviews: true
                }
              }
            }
          }
        }
      });

      // Transform the response to match CandidateResponse type
      return {
        id: updatedApplication.user.id,
        name: updatedApplication.user.name,
        email: updatedApplication.user.email,
        profile: updatedApplication.user.profile ? {
          skills: updatedApplication.user.profile.skills || [],
          location: updatedApplication.user.profile.location || null,
          bio: updatedApplication.user.profile.bio || null
        } : undefined,
        applications: updatedApplication.user.applications.map(app => ({
          id: app.id,
          job: {
            id: app.job.id,
            title: app.job.title || 'Untitled Job',
            company: app.job.company || 'Unnamed Company'
          },
          status: app.status,
          createdAt: app.createdAt,
          interviews: (app.interviews as EnhancedInterview[]).map(interview => ({
            id: interview.id,
            interviewType: interview.interviewType,
            date: interview.scheduledDate,
            status: interview.status,
            notes: interview.notes,
            interviewers: interview.interviewers,
            jobApplication: {
              id: interview.jobApplicationId ?? null,
              job: {
                id: interview.jobApplication?.job?.id ?? '',
                title: interview.jobApplication?.job?.title ?? '',
                company: interview.jobApplication?.job?.company ?? ''
              }
            }
          }))
        }))
      };
    } catch (error) {
      console.error('Error updating application status:', error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException('Failed to update application status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/job/:jobId')
  async getCandidatesByJob(
    @Param('jobId') jobId: string,
    @Query('applicationStatus') applicationStatus?: string
  ): Promise<CandidateResponse[]> {
    try {
      const candidates = await this.prisma.user.findMany({
        where: {
          role: 'CANDIDATE',
          applications: {
            some: {
              jobId: jobId,
            }
          }
        },
        include: {
          applications: {
            where: {
              jobId: jobId,
            },
            include: {
              job: true,
              interviews: true
            }
          },
          profile: true
        }
      });
      return candidates
        .filter(candidate => candidate.applications.length > 0)
        .map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          profile: candidate.profile ? {
            skills: candidate.profile.skills || [],
            location: candidate.profile.location || null,
            bio: candidate.profile.bio || null
          } : undefined,
          applications: candidate.applications.map(app => ({
            id: app.id,
            tags: app.tags,
            job: {
              id: app.job.id,
              title: app.job.title || 'Untitled Job',
              company: app.job.company || 'Unnamed Company'
            },
            status: app.status,
            createdAt: app.createdAt,
            interviews: (app.interviews as EnhancedInterview[]).map(interview => ({
              id: interview.id,
              interviewType: interview.interviewType,
              date: interview.scheduledDate,
              status: interview.status,
              notes: interview.notes,
              interviewers: interview.interviewers,
              jobApplication: {
                id: interview.jobApplicationId ?? null,
                job: {
                  id: interview.jobApplication?.job?.id ?? '',
                  title: interview.jobApplication?.job?.title ?? '',
                  company: interview.jobApplication?.job?.company ?? ''
                }
              }
            }))
          }))
        }));
    } catch (error) {
      console.error('Error fetching candidates by job:', error);
      throw new HttpException('Failed to fetch candidates by job', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
