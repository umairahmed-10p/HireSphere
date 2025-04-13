import { PrismaClient, JobStatus, UserRole, InterviewStatus, InterviewType, ApplicationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Utility function to generate a random date
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate dummy users
const generateUsers = (count: number) => {
  const hashedPassword = bcrypt.hashSync('password123', 10);
  return Array.from({ length: count }, () => ({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: hashedPassword,
    role: faker.helpers.arrayElement([UserRole.CANDIDATE, UserRole.EMPLOYER]),
    isActive: Math.random() > 0.1, // 90% active
    avatar: faker.image.avatarGitHub(),
    initials: faker.person.firstName().charAt(0) + faker.person.lastName().charAt(0)
  }));
};

// Generate dummy profiles
const generateProfiles = (users: any[]) => {
  return users.map(user => ({
    userId: user.id,
    bio: faker.lorem.paragraph(),
    location: faker.location.city(),
    skills: [
      faker.person.jobDescriptor(),
      faker.person.jobDescriptor(),
      faker.person.jobDescriptor(),
    ],
    education: {
      create: [{
        institution: faker.company.name(),
        degree: faker.person.jobTitle(),
        fieldOfStudy: faker.commerce.department(),
        startDate: faker.date.past(),
        endDate: faker.date.recent(),
        description: faker.lorem.sentence()
      }]
    },
    experience: {
      create: [{
        company: faker.company.name(),
        position: faker.person.jobTitle(),
        startDate: faker.date.past(),
        endDate: faker.date.recent(),
        description: faker.lorem.paragraph()
      }]
    }
  }));
};

// Generate dummy jobs
const generateJobs = (users: any[]) => {
  return users.map(user => ({
    title: faker.person.jobTitle(),
    description: faker.lorem.paragraph(),
    jobOverview: [
      'Develop and maintain scalable web applications using modern frameworks',
      'Collaborate with cross-functional teams to define, design, and ship new features',
      'Write clean, maintainable, and testable code',
      'Troubleshoot and debug applications to optimize performance',
      'Participate in code reviews and provide constructive feedback'
    ],
    responsibilities: [
      'Design and implement new features and improvements to our web platform',
      'Optimize application performance and ensure high-quality code',
      'Collaborate with product managers and designers to understand requirements',
      'Mentor junior developers and contribute to team knowledge sharing',
      'Stay updated with the latest web development trends and technologies'
    ],
    department: faker.commerce.department(),
    location: faker.location.city(),
    salary: parseFloat(faker.commerce.price({ min: 30000, max: 150000 })),
    status: JobStatus.OPEN,
    team: faker.company.buzzPhrase(),
    hiringManager: faker.person.fullName(),
    company: faker.company.name(),
    userId: user.id
  }));
};

// Generate dummy job applications
const generateJobApplications = (jobs: any[], users: any[]) => {
  const applications: any[] = [];
  for (const job of jobs) {
    const applicantUsers = users.filter(user => user.id !== job.userId);
    for (const user of applicantUsers.slice(0, faker.number.int({ min: 1, max: 5 }))) {
      applications.push({
        jobId: job.id,
        userId: user.id,
        status: faker.helpers.arrayElement([
          'APPLIED', 
          'INTERVIEWED', 
          'OFFERED', 
          'REJECTED'
        ]) as ApplicationStatus,
        currentStage: faker.helpers.arrayElement([
          'APPLICATION', 
          'SCREENING', 
          'INTERVIEW', 
          'ASSESSMENT', 
          'OFFER', 
          'HIRED', 
          'REJECTED'
        ]),
        notes: faker.lorem.sentence()
      });
    }
  }
  return applications;
};

// Generate dummy interviews
const generateInterviews = (jobApplications: any[]) => {
  return jobApplications
    .filter(() => Math.random() > 0.3)
    .map(application => ({
      jobApplicationId: application.id,
      candidateId: application.userId,
      interviewType: faker.helpers.arrayElement(Object.values(InterviewType)),
      status: faker.helpers.arrayElement(Object.values(InterviewStatus)),
      scheduledDate: randomDate(new Date(), new Date(2024, 11, 31)),
      interviewers: [faker.person.fullName()],
      duration: faker.number.int({ min: 30, max: 90 }),
      notes: faker.lorem.sentence()
    }));
};

// Generate dummy application documents
const generateApplicationDocuments = (jobs: any[]) => {
  return jobs.flatMap(job => 
    Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
      jobId: job.id,
      name: faker.system.fileName(),
      fileType: faker.helpers.arrayElement(['PDF', 'DOCX', 'TXT', 'XLSX']),
      fileUrl: faker.internet.url(),
      uploadedBy: faker.person.fullName(),
      description: faker.lorem.sentence()
    }))
  );
};

async function main() {
  try {
    // Delete existing data in the correct order to avoid foreign key constraints
    await prisma.interview.deleteMany();
    await prisma.jobApplication.deleteMany();
    await prisma.applicationDocument.deleteMany();
    await prisma.job.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.education.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // Generate and create users
    const userInputs = generateUsers(20);
    const users = await Promise.all(
      userInputs.map(user => prisma.user.create({ data: user }))
    );

    // Generate and create profiles with education and experience
    const profileInputs = generateProfiles(users);
    const profiles = await Promise.all(
      profileInputs.map(profile => prisma.profile.create({ data: profile }))
    );

    // Generate and create jobs
    const jobInputs = generateJobs(users);
    const jobs = await Promise.all(
      jobInputs.map(job => prisma.job.create({ data: job }))
    );

    // Generate and create application documents
    const documentInputs = generateApplicationDocuments(jobs);
    await Promise.all(
      documentInputs.map(doc => prisma.applicationDocument.create({ data: doc }))
    );

    // Generate and create job applications
    const jobApplicationInputs = generateJobApplications(jobs, users);
    const jobApplications = await Promise.all(
      jobApplicationInputs.map(application => prisma.jobApplication.create({ data: application }))
    );

    // Generate and create interviews
    const interviewInputs = generateInterviews(jobApplications);
    await Promise.all(
      interviewInputs.map(interview => prisma.interview.create({ data: interview }))
    );

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
