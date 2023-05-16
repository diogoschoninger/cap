import dotenv from 'dotenv';
import { expressjwt } from 'express-jwt';
import { Algorithm, Secret } from 'jsonwebtoken';

dotenv.config();

export default expressjwt({
  secret: process.env.SECRET as Secret,
  algorithms: [process.env.ALGORITHM as Algorithm],
});
