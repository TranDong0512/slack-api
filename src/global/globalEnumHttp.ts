export enum HttpStatus {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  NOT_ACCEPTABLE = 406,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  BAD_CONNECTIONS_DB = 2002,
}

export enum HttpMessage {
  SUCCESS = 'Success',
  CREATED = 'Resource created successfully',
  BAD_REQUEST = 'Bad request',
  UNAUTHORIZED = 'Unauthorized access',
  FORBIDDEN = 'Access is forbidden',
  NOT_FOUND = 'Resource not found',
  NOT_ACCEPTABLE = 'Not acceptable',
  CONFLICT = 'Conflict error',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  BAD_CONNECTIONS_DB = 'Bad connection to database',
}
