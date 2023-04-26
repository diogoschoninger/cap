import { Request, Response, Router } from 'express';

import asyncError from './middlewares/asyncError';
import validateSchema from './middlewares/validateSchema';
import schemas from './utils/schemas';
import { db } from './db/config';

const router = Router();

router.get('/', (req, res) => res.status(200).send('Hello world'));

router.post(
  '/login',
  validateSchema(schemas.login),
  asyncError(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await db.query(
      `SELECT * FROM users WHERE email LIKE "${email}"`
    );

    res.send(user);
  })
);

export default router;
