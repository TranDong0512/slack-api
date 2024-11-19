import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly mailService: MailService) {}

  async signUp(user: any) {
    await this.mailService.sendUserConfirmation(user);
  }

  async signIn(user: SignInDto): Promise<{ accessToken: string }> {
    const user;
    return { accessToken: 'your-token-generation-method' };
  }
}
