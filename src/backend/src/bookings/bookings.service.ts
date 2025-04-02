import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    // Validate experience exists
    const experience = await this.prisma.experience.findUnique({
      where: { id: createBookingDto.experienceId },
      include: { host: true }
    });

    if (!experience) {
      throw new BadRequestException('Experience not found');
    }

    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createBookingDto.userId }
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Create the booking
    const booking = await this.prisma.booking.create({
      data: createBookingDto,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        experience: {
          select: {
            title: true,
            price: true,
            host: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Send booking confirmation email to user
    try {
      await this.emailService.sendBookingConfirmation(
        user.email,
        user.firstName,
        {
          experienceName: experience.title,
          date: booking.date,
          participants: booking.participants,
          totalAmount: booking.totalAmount
        }
      );
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
    }

    // Send booking notification to guide/host
    try {
      await this.emailService.sendGuideBookingNotification(
        experience.host.email,
        experience.host.firstName,
        {
          experienceName: experience.title,
          date: booking.date,
          participants: booking.participants,
          customerName: `${user.firstName} ${user.lastName}`
        }
      );
    } catch (error) {
      console.error('Failed to send guide booking notification email:', error);
    }

    return booking;
  }

  async findAll(userId?: string) {
    console.log('Finding all bookings with userId filter:', userId);
    const filter = userId ? { userId } : {};
    
    try {
      const bookings = await this.prisma.booking.findMany({
        where: filter,
        include: {
          experience: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      console.log(`Found ${bookings.length} bookings`);
      return bookings;
    } catch (error) {
      console.error('Error finding bookings:', error);
      throw error;
    }
  }
  
  async findAllWithFilters(filters: {
    userId?: string;
    experienceId?: string;
    date?: string;
    status?: string;
    hostId?: string;
  }) {
    console.log('Finding bookings with filters:', filters);
    
    // Build the Prisma query
    const where: any = {};
    
    if (filters.userId) {
      where.userId = filters.userId;
    }
    
    if (filters.experienceId) {
      where.experienceId = filters.experienceId;
    }
    
    if (filters.date) {
      // Exact date match
      where.date = new Date(filters.date);
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.hostId) {
      // If hostId is provided, we need to get all experiences from that host
      // and find bookings for those experiences
      const experiences = await this.prisma.experience.findMany({
        where: { hostId: filters.hostId },
        select: { id: true },
      });
      
      const experienceIds = experiences.map(exp => exp.id);
      if (experienceIds.length > 0) {
        where.experienceId = { in: experienceIds };
      } else {
        // Return empty array if provider has no experiences
        return [];
      }
    }
    
    try {
      const bookings = await this.prisma.booking.findMany({
        where,
        include: {
          experience: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      console.log(`Found ${bookings.length} bookings with filters`);
      return bookings;
    } catch (error) {
      console.error('Error finding bookings with filters:', error);
      throw error;
    }
  }

  async findAllForAdmin() {
    return this.prisma.booking.findMany({
      include: {
        experience: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  
  async findAllForProvider(hostId: string) {
    console.log('Finding bookings for provider with hostId:', hostId);
    
    try {
      // First get all experiences for this provider
      const experiences = await this.prisma.experience.findMany({
        where: { hostId },
        select: { id: true },
      });
      
      const experienceIds = experiences.map(exp => exp.id);
      console.log('Experience IDs for host:', experienceIds);
      
      if (experienceIds.length === 0) {
        return [];
      }
      
      // Then get all bookings for these experiences
      const bookings = await this.prisma.booking.findMany({
        where: {
          experienceId: {
            in: experienceIds,
          },
        },
        include: {
          experience: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      console.log(`Found ${bookings.length} bookings for provider ${hostId}`);
      return bookings;
    } catch (error) {
      console.error('Error finding bookings for provider:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        experience: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id);

    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
      include: {
        experience: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
