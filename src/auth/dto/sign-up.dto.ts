import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from 'src/lib/match.decorator';
export class SignUpDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  @Matches(/[A-Z]/, {
    message: 'Password must have at least one letter in uppercase',
  })
  @Matches(/[a-z]/, {
    message: 'Password must have at least one letter in lowercase',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/[@$!%*?&]/, {
    message: 'Password must contain at least one special character (@$!%*?&)',
  })
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password')
  confirmPassword: string;
}
