// This file is kept for reference only. 
// With Prisma, we define models in prisma/schema.prisma instead.

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
