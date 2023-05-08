import { expressjwt } from 'express-jwt';
import { Algorithm, Secret } from 'jsonwebtoken';

import { jwtConfig } from '../utils/auth';

export default expressjwt({
  secret: jwtConfig.secret as Secret,
  algorithms: [process.env.ALGORITHM as Algorithm],
});
