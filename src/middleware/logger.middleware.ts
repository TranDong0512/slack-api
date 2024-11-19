import { JwtService } from '@nestjs/jwt';
import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { ResponseData } from 'src/global/globalResponse';
import { HttpStatus } from 'src/global/globalEnumHttp';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    console.log('logger middleware');

    const token = req.get('Authorization')?.split(' ').slice(-1).join();
    if (!token) {
      throw new HttpException(
        new ResponseData(null, HttpStatus.UNAUTHORIZED, 'Unauthorized'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const decoded = this.jwtService.decode(token);
    if (!decoded) {
      throw new HttpException(
        new ResponseData(null, HttpStatus.UNAUTHORIZED, 'Invalid token format'),
        HttpStatus.UNAUTHORIZED,
      );
    }
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && currentTime > decoded.exp) {
      throw new HttpException(
        new ResponseData(null, HttpStatus.UNAUTHORIZED, 'TokenExpiredError'),
        HttpStatus.UNAUTHORIZED,
      );
    }
    next();
  }
}
