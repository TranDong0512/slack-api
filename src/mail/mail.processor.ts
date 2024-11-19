import { Processor, OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from './mail.service';

@Processor('emailSlack')
export class MailProcessor extends WorkerHost {
  constructor(protected readonly emailService: MailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { data } = job;

    try {
      console.log(`Processing email job for user: ${data.user.email}`);
      await this.emailService.sendUserConfirmation(data.user);
      console.log(`Email sent successfully to ${data.user.email}`);
    } catch (error) {
      console.error(`Error sending email to ${data.user.email}:`, error);
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed successfully`);
  }

  onFailed(job: Job, error: Error) {
    console.log(`Job ${job.id} failed with error: ${error.message}`);
  }
}
