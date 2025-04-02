
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    // Create a test account if no SMTP config is provided
    if (!this.configService.get('SMTP_HOST')) {
      this.createTestAccount();
    } else {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('SMTP_HOST'),
        port: this.configService.get('SMTP_PORT'),
        secure: this.configService.get('SMTP_SECURE') === 'true',
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASS'),
        },
      });
    }
  }

  private async createTestAccount() {
    // Create testing account with ethereal email
    const testAccount = await nodemailer.createTestAccount();
    
    // Create reusable transporter
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log('Using test email account:', testAccount.user);
  }

  async sendRegistrationEmail(email: string, firstName: string) {
    const info = await this.transporter.sendMail({
      from: `"EcoTours Rwanda" <${this.configService.get('SMTP_FROM') || 'noreply@ecotours.com'}>`,
      to: email,
      subject: 'Welcome to EcoTours Rwanda',
      html: `
        <h1>Welcome to EcoTours Rwanda, ${firstName}!</h1>
        <p>Thank you for registering with us. We're excited to have you join our community!</p>
        <p>You can now explore and book amazing eco-friendly experiences in Rwanda.</p>
        <p>Best regards,<br>The EcoTours Rwanda Team</p>
      `,
    });

    console.log('Registration email sent: %s', info.messageId);
    // Preview URL with Ethereal
    if (info.messageId && !this.configService.get('SMTP_HOST')) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  }

  async sendBookingConfirmation(email: string, firstName: string, bookingDetails: any) {
    const info = await this.transporter.sendMail({
      from: `"EcoTours Rwanda" <${this.configService.get('SMTP_FROM') || 'noreply@ecotours.com'}>`,
      to: email,
      subject: 'Booking Confirmation - EcoTours Rwanda',
      html: `
        <h1>Booking Confirmation</h1>
        <p>Dear ${firstName},</p>
        <p>Your booking has been confirmed!</p>
        <h2>Booking Details:</h2>
        <p><strong>Experience:</strong> ${bookingDetails.experienceName}</p>
        <p><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</p>
        <p><strong>Participants:</strong> ${bookingDetails.participants}</p>
        <p><strong>Total Amount:</strong> $${bookingDetails.totalAmount}</p>
        <p>We're looking forward to providing you with an amazing experience!</p>
        <p>Best regards,<br>The EcoTours Rwanda Team</p>
      `,
    });

    console.log('Booking confirmation email sent: %s', info.messageId);
    if (info.messageId && !this.configService.get('SMTP_HOST')) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  }

  async sendCourseEnrollmentConfirmation(email: string, firstName: string, courseDetails: any) {
    const info = await this.transporter.sendMail({
      from: `"EcoTours Rwanda" <${this.configService.get('SMTP_FROM') || 'noreply@ecotours.com'}>`,
      to: email,
      subject: `Course Enrollment: ${courseDetails.title}`,
      html: `
        <h1>Course Enrollment Confirmation</h1>
        <p>Dear ${firstName},</p>
        <p>You have successfully enrolled in the following course:</p>
        <h2>${courseDetails.title}</h2>
        <p>${courseDetails.description}</p>
        <p><strong>Duration:</strong> ${courseDetails.duration}</p>
        <p>You will receive further instructions and course materials shortly.</p>
        <p>Best regards,<br>The EcoTours Rwanda Team</p>
      `,
    });

    console.log('Course enrollment email sent: %s', info.messageId);
    if (info.messageId && !this.configService.get('SMTP_HOST')) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  }

  async sendGuideBookingNotification(email: string, firstName: string, bookingDetails: any) {
    const info = await this.transporter.sendMail({
      from: `"EcoTours Rwanda" <${this.configService.get('SMTP_FROM') || 'noreply@ecotours.com'}>`,
      to: email,
      subject: 'New Booking Received - EcoTours Rwanda',
      html: `
        <h1>New Booking Notification</h1>
        <p>Dear ${firstName},</p>
        <p>A new booking has been made for one of your experiences:</p>
        <h2>Booking Details:</h2>
        <p><strong>Experience:</strong> ${bookingDetails.experienceName}</p>
        <p><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</p>
        <p><strong>Participants:</strong> ${bookingDetails.participants}</p>
        <p><strong>Customer:</strong> ${bookingDetails.customerName}</p>
        <p>Please log into your guide portal to manage this booking.</p>
        <p>Best regards,<br>The EcoTours Rwanda Team</p>
      `,
    });

    console.log('Guide booking notification email sent: %s', info.messageId);
    if (info.messageId && !this.configService.get('SMTP_HOST')) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  }
}
