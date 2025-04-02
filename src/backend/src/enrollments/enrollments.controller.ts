
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto, @Request() req) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    // Admin can see all enrollments, users can only see their own
    if (req.user.isAdmin) {
      return this.enrollmentsService.findAll();
    }
    return this.enrollmentsService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const enrollment = await this.enrollmentsService.findOne(id);
    // Ensure users can only view their own enrollments unless they're admin
    if (req.user.isAdmin || req.user.id === enrollment.userId) {
      return enrollment;
    }
    return { error: 'Unauthorized' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
    @Request() req
  ) {
    // Only admins can update enrollments
    if (req.user.isAdmin) {
      return this.enrollmentsService.update(id, updateEnrollmentDto);
    }
    return { error: 'Unauthorized' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/complete')
  async complete(@Param('id') id: string, @Request() req) {
    const enrollment = await this.enrollmentsService.findOne(id);
    // Only admins or the enrolled user can mark as complete
    if (req.user.isAdmin || req.user.id === enrollment.userId) {
      return this.enrollmentsService.complete(id);
    }
    return { error: 'Unauthorized' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const enrollment = await this.enrollmentsService.findOne(id);
    // Only admins or the enrolled user can delete enrollments
    if (req.user.isAdmin || req.user.id === enrollment.userId) {
      return this.enrollmentsService.remove(id);
    }
    return { error: 'Unauthorized' };
  }
}
