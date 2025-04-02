
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    console.log('Creating booking with DTO:', createBookingDto);
    console.log('User from request:', req.user);
    
    // Ensure the user can only create bookings for themselves
    if (req.user.isAdmin || req.user.id === createBookingDto.userId) {
      return this.bookingsService.create(createBookingDto);
    }
    return { error: 'Unauthorized' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Request() req, 
    @Query('userId') userId: string, 
    @Query('hostId') hostId: string,
    @Query('experienceId') experienceId: string,
    @Query('date') date: string,
    @Query('status') status: string
  ) {
    console.log('Finding bookings with filters:', { userId, hostId, experienceId, date, status });
    
    const filters = {
      userId: userId || undefined,
      experienceId: experienceId || undefined,
      date: date || undefined,
      status: status || undefined,
      hostId: hostId || undefined
    };
    
    // Admin can see all bookings, users can only see their own
    if (req.user.isAdmin) {
      return this.bookingsService.findAllWithFilters(filters);
    }
    
    // If a user is trying to see bookings for an experience they host
    if (hostId && hostId === req.user.id) {
      return this.bookingsService.findAllWithFilters({ ...filters, hostId: req.user.id });
    }
    
    // Regular users can only see their own bookings
    return this.bookingsService.findAllWithFilters({ ...filters, userId: req.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllForAdmin(@Request() req) {
    // Only admins can access this endpoint
    if (req.user.isAdmin) {
      return this.bookingsService.findAllForAdmin();
    }
    return { error: 'Unauthorized' };
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('provider/:hostId')
  findAllForProvider(@Param('hostId') hostId: string, @Request() req) {
    console.log('Finding bookings for provider with hostId:', hostId);
    
    // Provider can only see bookings for their own experiences
    if (req.user.isAdmin || req.user.id === hostId) {
      return this.bookingsService.findAllForProvider(hostId);
    }
    return { error: 'Unauthorized' };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const booking = await this.bookingsService.findOne(id);
    // Ensure users can only view their own bookings unless they're admin
    if (req.user.isAdmin || req.user.id === booking.userId) {
      return booking;
    }
    return { error: 'Unauthorized' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req
  ) {
    const booking = await this.bookingsService.findOne(id);
    // Ensure users can only update their own bookings unless they're admin
    if (req.user.isAdmin || req.user.id === booking.userId) {
      return this.bookingsService.update(id, updateBookingDto);
    }
    return { error: 'Unauthorized' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const booking = await this.bookingsService.findOne(id);
    // Ensure users can only delete their own bookings unless they're admin
    if (req.user.isAdmin || req.user.id === booking.userId) {
      return this.bookingsService.remove(id);
    }
    return { error: 'Unauthorized' };
  }
}
