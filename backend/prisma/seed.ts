import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.jobApplication.deleteMany();
  await prisma.job.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        password: await bcrypt.hash('password456', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike.johnson@example.com',
        name: 'Mike Johnson',
        password: await bcrypt.hash('password789', 10),
      },
    }),
  ]);

  // Create Profiles
  const profiles = await Promise.all(
    users.map((user, index) => 
      prisma.profile.create({
        data: {
          userId: user.id,
          bio: `Professional bio for ${user.name}`,
          location: ['New York', 'San Francisco', 'Chicago'][index],
          skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
        },
      })
    )
  );

  // Create Education
  await Promise.all(
    profiles.map((profile, index) => 
      prisma.education.createMany({
        data: [
          {
            profileId: profile.id,
            institution: ['Harvard University', 'MIT', 'Stanford'][index],
            degree: ['Computer Science', 'Software Engineering', 'Data Science'][index],
            startDate: new Date('2015-09-01'),
            endDate: new Date('2019-06-30'),
          },
        ],
      })
    )
  );

  // Create Experience
  await Promise.all(
    profiles.map((profile, index) => 
      prisma.experience.createMany({
        data: [
          {
            profileId: profile.id,
            company: ['Google', 'Facebook', 'Amazon'][index],
            position: ['Software Engineer', 'Senior Developer', 'Tech Lead'][index],
            startDate: new Date('2019-07-01'),
            endDate: null,
            description: 'Working on cutting-edge technology solutions',
          },
        ],
      })
    )
  );

  // Create Jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Senior Software Engineer',
        description: 'Looking for an experienced software engineer',
        company: 'Tech Innovations Inc.',
        location: 'San Francisco, CA',
        salary: 150000,
        userId: users[0].id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Frontend Developer',
        description: 'React and TypeScript expert needed',
        company: 'Web Solutions LLC',
        location: 'New York, NY',
        salary: 120000,
        userId: users[1].id,
      },
    }),
  ]);

  // Create Job Applications
  await prisma.jobApplication.createMany({
    data: [
      {
        jobId: jobs[0].id,
        userId: users[1].id,
        status: 'APPLIED',
      },
      {
        jobId: jobs[1].id,
        userId: users[0].id,
        status: 'INTERVIEWED',
      },
    ],
  });

  console.log('Dummy data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
