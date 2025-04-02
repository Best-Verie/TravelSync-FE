
import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatsService } from './stats.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  findAll() {
    return this.statsService.findAll();
  }

  @Get('app')
  getAppStats() {
    return this.statsService.getAppStats();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrUpdate(@Body() createStatDto: CreateStatDto) {
    return this.statsService.createOrUpdate(createStatDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatDto: UpdateStatDto) {
    return this.statsService.update(id, updateStatDto);
  }
}
