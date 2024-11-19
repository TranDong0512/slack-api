import * as bcrypt from 'bcrypt';

export const hashUtils = {
  hash: (input: string): string => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(input, salt);
  },

  compare: (input: string, hash: string): boolean => {
    return bcrypt.compareSync(input, hash);
  },
};
