
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getAppStats() {
    const [
      totalUsers,
      totalExperiences,
      totalBookings,
      userRegistrations
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.experience.count(),
      this.prisma.booking.count(),
      this.prisma.registration.count(),
    ]);

    return {
      totalUsers,
      totalExperiences,
      totalBookings,
      userRegistrations,
    };
  }

  async findAll() {
    return this.prisma.stat.findMany();
  }

  async createOrUpdate(createStatDto: CreateStatDto) {
    const { title } = createStatDto;
    
    const existingStat = await this.prisma.stat.findFirst({
      where: { title },
    });
    
    if (existingStat) {
      return this.prisma.stat.update({
        where: { id: existingStat.id },
        data: createStatDto,
      });
    }
    
    return this.prisma.stat.create({
      data: createStatDto,
    });
  }

  async update(id: string, updateStatDto: UpdateStatDto) {
    return this.prisma.stat.update({
      where: { id },
      data: updateStatDto,
    });
  }
}
