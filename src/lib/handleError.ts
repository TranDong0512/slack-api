import { HttpException } from '@nestjs/common';
import { HttpStatus } from 'src/global/globalEnumHttp';

export function handleError(error: any) {
  if (error instanceof HttpException) {
    const status = error.getStatus();
    switch (status) {
      case HttpStatus.NOT_FOUND:
        throw new HttpException(error.message, status);
      case HttpStatus.CONFLICT:
        throw new HttpException(error.message, status);
      case HttpStatus.BAD_CONNECTIONS_DB:
        throw new HttpException(error.message, status);
      case HttpStatus.UNAUTHORIZED:
        throw new HttpException(error.message, status);
      default:
        throw new HttpException(
          error.message || 'An unexpected error occurred',
          status,
        );
    }
  }
  throw new HttpException(
    error.message || 'Internal Server Error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
