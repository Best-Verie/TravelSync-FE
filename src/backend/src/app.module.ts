
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { BookingsModule } from './bookings/bookings.module';
import { StatsModule } from './stats/stats.module';
import { ContactModule } from './contact/contact.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { CoursesModule } from './courses/courses.module';
import { EmailModule } from './email/email.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Make ConfigModule global
    PrismaModule,
    UsersModule,
    AuthModule,
    ExperiencesModule,
    BookingsModule,
    StatsModule,
    ContactModule,
    RegistrationsModule,
    CoursesModule,
    EmailModule,
    EnrollmentsModule,
  ],
})
export class AppModule {}
