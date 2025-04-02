
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createEnrollmentDto.userId }
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Remove the restriction for tourists to enroll in courses
    // All user types (tourist, guide/provider) can now enroll

    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: createEnrollmentDto.courseId }
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    // Check if enrollment already exists
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId: createEnrollmentDto.userId,
        courseId: createEnrollmentDto.courseId
      }
    });

    if (existingEnrollment) {
      throw new ConflictException('User is already enrolled in this course');
    }

    // Create the enrollment
    const enrollment = await this.prisma.enrollment.create({
      data: {
        userId: createEnrollmentDto.userId,
        courseId: createEnrollmentDto.courseId,
        status: 'enrolled', // Default status
        completedAt: null, // Not completed initially
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        course: true
      }
    });

    // Send enrollment confirmation email
    try {
      await this.emailService.sendCourseEnrollmentConfirmation(
        user.email,
        user.firstName,
        {
          title: course.title,
          description: course.description,
          duration: course.duration
        }
      );
    } catch (error) {
      console.error('Failed to send course enrollment confirmation email:', error);
    }

    return enrollment;
  }

  async findAll(userId?: string) {
    const where = userId ? { userId } : {};
    
    return this.prisma.enrollment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        course: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        course: true
      }
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return enrollment;
  }

  async update(id: string, updateEnrollmentDto: UpdateEnrollmentDto) {
    await this.findOne(id);

    return this.prisma.enrollment.update({
      where: { id },
      data: updateEnrollmentDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        course: true
      }
    });
  }

  async complete(id: string) {
    const enrollment = await this.findOne(id);

    return this.prisma.enrollment.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        course: true
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.enrollment.delete({
      where: { id }
    });
  }
}
