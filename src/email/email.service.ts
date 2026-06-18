import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envConfig } from '../config/env';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envConfig.smtp.host,
      port: envConfig.smtp.port,
      secure: envConfig.smtp.port === 465,
      auth: {
        user: envConfig.smtp.user,
        pass: envConfig.smtp.pass,
      },
    });
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationUrl = `${envConfig.app.url}/api/auth/verify-email?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: envConfig.smtp.from,
        to,
        subject: 'Verify your email address',
        text: `Please verify your email by clicking the link below:\n\n${verificationUrl}\n\nThis link expires in 24 hours.`,
      });
      this.logger.log(`Verification email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${to}`, error);
      throw error;
    }
  }
}
