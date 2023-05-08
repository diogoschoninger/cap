import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { QueryTypes } from 'sequelize';

import db from './db/config';
import asyncErrorHandler from './middlewares/asyncError';
import { encrypt, jwtConfig } from './utils/auth';
import { AuthenticationError } from './utils/errors';
import safeCompare from './utils/safeCompare';
import stringToNumber from './utils/stringToNumber';

export default {
  // SESSÃO
  register: asyncErrorHandler(async (req: Request, res: Response) => {
    const user = {
      ...req.body,
      password: await encrypt(req.body.password),
    };

    await db.query(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      {
        replacements: [user.name, user.email, user.password],
        type: QueryTypes.INSERT,
      }
    );

    res.status(201).send({});
  }),

  login: asyncErrorHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const [result, _metadata]: any = await db.query(
      `SELECT * FROM users WHERE email LIKE "${email}"`
    );

    if (result.length < 1) throw new AuthenticationError('Invalid credentials');

    const { password: userPassword, ...user } = result[0];

    const encrypted = await encrypt(password);

    const isValid = await safeCompare(encrypted, userPassword);

    if (!isValid) throw new AuthenticationError('Invalid credentials');

    const token = jwt.sign(user, jwtConfig.secret as Secret, {
      expiresIn: jwtConfig.expiration,
    });

    res.status(200).send({ token, user });
  }),

  verifySession: asyncErrorHandler(async (req: Request, res: Response) => {
    res.status(200).send({ authenticated: true });
  }),

  // DADOS DOS DOCUMENTOS
  listPayments: asyncErrorHandler(async (req: Request, res: Response) => {
    const data: any = await db.query('SELECT * FROM payments', {
      type: QueryTypes.SELECT,
    });

    res.status(200).send(data);
  }),

  listSituations: asyncErrorHandler(async (req: Request, res: Response) => {
    const data: any = await db.query('SELECT * FROM situations', {
      type: QueryTypes.SELECT,
    });

    res.status(200).send(data);
  }),

  // DOCUMENTOS
  createDocument: asyncErrorHandler(async (req: Request, res: Response) => {
    const body = req.body;

    body.value = stringToNumber(body.value);

    await db.query(
      `INSERT INTO documents (description, value, date, user_owner, payment, situation, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      {
        replacements: [
          body.description,
          body.value,
          body.date,
          body.user_owner,
          body.payment,
          body.situation,
        ],
        type: QueryTypes.INSERT,
      }
    );

    res.status(201).send();
  }),

  listDocuments: asyncErrorHandler(async (req: Request, res: Response) => {
    const token = req.get('Authorization')?.split(' ')[1];
    const decoded: any = jwt.verify(
      token as string,
      jwtConfig.secret as Secret
    );
    const user_id = decoded.id;

    const data = await db.query(
      'SELECT * FROM documents WHERE user_owner = ? ORDER BY date, created_at',
      { replacements: [user_id], type: QueryTypes.SELECT }
    );

    res.status(200).send(data);
  }),
};
