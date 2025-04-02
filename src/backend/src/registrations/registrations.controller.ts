
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  create(@Body() createRegistrationDto: CreateRegistrationDto) {
    return this.registrationsService.create(createRegistrationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    // Admin can see all registrations, users can only see their own
    if (req.user.isAdmin) {
      return this.registrationsService.findAll();
    }
    return this.registrationsService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const registration = await this.registrationsService.findOne(id);
    // Ensure users can only view their own registrations unless they're admin
    if (req.user.isAdmin || req.user.id === registration.userId) {
      return registration;
    }
    return { error: 'Unauthorized' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateRegistrationDto: UpdateRegistrationDto,
    @Request() req
  ) {
    // Only admins can update registrations
    if (req.user.isAdmin) {
      return this.registrationsService.update(id, updateRegistrationDto);
    }
    return { error: 'Unauthorized' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const registration = await this.registrationsService.findOne(id);
    // Ensure users can only delete their own registrations unless they're admin
    if (req.user.isAdmin || req.user.id === registration.userId) {
      return this.registrationsService.remove(id);
    }
    return { error: 'Unauthorized' };
  }
}
