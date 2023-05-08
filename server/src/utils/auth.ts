import { BinaryLike, pbkdf2Sync } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export const encrypt = async (data: string) =>
  pbkdf2Sync(
    data,
    process.env.SALT as BinaryLike,
    Number(process.env.ITERATIONS) as any,
    Number(process.env.KEY_LENGTH) as any,
    process.env.DIGEST as string
  ).toString('hex');

export const jwtConfig = {
  secret: process.env.SECRET,
  expiration: process.env.EXPIRATION,
};
