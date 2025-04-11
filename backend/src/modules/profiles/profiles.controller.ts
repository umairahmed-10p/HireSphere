import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Body, 
  Param, 
  UseGuards,
  Request 
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async createProfile(
    @Request() req,
    @Body() createProfileDto: CreateProfileDto
  ) {
    return this.profilesService.createProfile(req.user.id, createProfileDto);
  }

  @Get()
  async getProfile(@Request() req) {
    return this.profilesService.getProfileByUserId(req.user.id);
  }

  @Patch()
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.profilesService.updateProfile(req.user.id, updateProfileDto);
  }
}
