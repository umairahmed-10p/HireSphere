import { Controller, Post, Body, UseGuards, Request, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  @Post('register')
  async register(@Body() registerDto: {
    email: string;
    password: string;
    name: string;
  }) {
    this.logger.log(`Register attempt for email: ${registerDto.email}`);
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
