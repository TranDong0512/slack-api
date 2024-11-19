import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Render,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';
import { UsersModel } from 'src/users/users.models';
import { ResponseData } from 'src/global/globalResponse';
import { HttpStatus } from 'src/global/globalEnumHttp';
import { MailService } from 'src/mail/mail.service';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { SignInDto } from './dto/sign-in.dto';

@UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  @Post('/signup')
  async signUp(
    @Body() createUserDto: SignUpDto,
  ): Promise<ResponseData<UsersModel>> {
    const user = await this.usersService.createUser(createUserDto);
    if (user) {
      const token = 'your-token-generation-method';
      await this.mailService.sendEmailJob(user, token);
      return new ResponseData<UsersModel>(
        user,
        HttpStatus.CREATED,
        'User created successfully',
      );
    }
  }

  @Get('/active')
  @Render('confirmationSuccess')
  async activeUser(@Query('token') token: string): Promise<any> {
    if (!token) {
      throw new HttpException(
        'Email or status is missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.usersService.activeUser(token);

    return {
      url: `http://localhost:3000/auth/active?token=${token}`,
    };
  }

  @Post('/signin')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<ResponseData<UsersModel>> {
    const user = await this.authService.signIn(signInDto);
    return user;
  }
}
