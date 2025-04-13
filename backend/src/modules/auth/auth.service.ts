import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) {
    // Implement user validation logic
    return null;
  }

  async login(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true
      }
    });

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { 
      sub: user.id, 
      email: user.email 
    };

    // Remove password from user object before returning
    const { password: _, ...userWithoutPassword } = user;

    return {
      token: await this.jwtService.signAsync(payload),
      user: userWithoutPassword
    };
  }

  async register(registerDto: {
    email: string;
    password: string;
    name: string;
  }) {
    const { email, password, name } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    // Generate JWT token
    const payload = { 
      sub: user.id, 
      email: user.email 
    };

    return {
      token: await this.jwtService.signAsync(payload),
      user
    };
  }
}
