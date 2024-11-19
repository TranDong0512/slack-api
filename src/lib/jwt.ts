import * as jwt from 'jsonwebtoken';
export const jwtUtils = {
  jwtSign: (data): string => {
    const token = jwt.sign(data, process.env.JWT_ACCESS_SECRET);
    return token;
  },
  jwtVerify: (data): string | object => {
    const token = jwt.verify(data, process.env.JWT_ACCESS_SECRET);
    return token;
  },
};
