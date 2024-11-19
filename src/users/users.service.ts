import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { HttpStatus } from 'src/global/globalEnumHttp';
import { Users } from 'src/schemas/users.schema';
import { v4 as uuid4 } from 'uuid';
import { handleError } from 'src/lib/handleError';
import { hashUtils } from 'src/lib/hashBcrypt';
import { jwtUtils } from 'src/lib/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModule: Model<Users>,
  ) {}
  async createUser(userDTO: SignUpDto): Promise<Users> {
    try {
      const findUser = await this.usersModule.findOne({
        email: userDTO.email,
      });
      if (findUser) {
        throw new HttpException('Email already exists!', HttpStatus.CONFLICT);
      }

      const nameUser = userDTO.email.split('@')[0];
      const hashedPassword = hashUtils.hash(userDTO.password);

      const newUser = new this.usersModule({
        email: userDTO.email,
        name: nameUser,
        apiKey: uuid4(),
        role: 'user',
        password: hashedPassword,
      });

      const savedUser = await newUser.save();
      const userObject = savedUser.toObject();
      delete userObject.password;
      return userObject;
    } catch (error) {
      handleError(error);
    }
  }
  async activeUser(token: string): Promise<Users> {
    try {
      const verifyEmail = jwtUtils.jwtVerify(token);
      const user = await this.usersModule.findOne({
        email: verifyEmail,
      });
      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
      await this.usersModule.updateOne(
        { email: verifyEmail },
        { status: 'active' },
      );
      const updatedUser = await this.usersModule.findOne({
        email: verifyEmail,
        select: '-password',
      });
      return updatedUser;
    } catch (err) {
      handleError(err);
    }
  }
}
