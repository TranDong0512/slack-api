import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { jwtUtils } from 'src/lib/jwt';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectQueue('emailSlack') private readonly emailQueue: Queue,
  ) {}
  async sendEmailJob(user: any, token: string) {
    await this.emailQueue.add(
      'sendEmail',
      { user, token },
      { attempts: 3, backoff: 5000 },
    );
  }

  async sendUserConfirmation(user) {
    const token = jwtUtils.jwtSign(user.email);
    console.log(token);
    const url = `http://localhost:3000/auth/active?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: `"${process.env.SMTP_FROM_EMAIL}" <${process.env.SMTP_FROM_EMAIL}>`, // override default from
      subject: 'Welcome to Slack App! Confirm your Email',
      template: 'confirmation',
      context: {
        url,
        name: user.name,
        email: user.email,
        status: 'active',
      },
    });
  }
}
