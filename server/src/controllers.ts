import {
  Request,
  Response,
} from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { QueryTypes } from 'sequelize';

import db from './db/config';
import asyncErrorHandler from './middlewares/asyncError';
import {
  encrypt,
  jwtConfig,
} from './utils/auth';
import {
  AuthenticationError,
  NotFoundError,
} from './utils/errors';
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

    const [result]: any = await db.query(
      `SELECT * FROM users WHERE email LIKE "${email}"`, { type: QueryTypes.SELECT}
    );

    if (!result)
      throw new NotFoundError(`Usuário com email ${email} não encontrado`);

    const { password: userPassword, ...user } = result;

    const encrypted = await encrypt(password);

    const isValid = await safeCompare(encrypted, userPassword);

    if (!isValid) throw new AuthenticationError('Senha inválida');

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
      `INSERT INTO documents (description, value, expiration, user_owner, payment, situation, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      {
        replacements: [
          body.description,
          body.value,
          body.expiration,
          body.user_owner,
          body.payment,
          body.situation,
        ],
        type: QueryTypes.INSERT,
      }
    );

    res.status(201).send({});
  }),

  listDocuments: asyncErrorHandler(async (req: Request, res: Response) => {
    const token = req.get('Authorization')?.split(' ')[1];
    const decoded: any = jwt.verify(
      token as string,
      jwtConfig.secret as Secret
    );
    const user_id = decoded.id;

    const data = await db.query(
      `SELECT
        documents.id,
        documents.description,
        documents.value,
        documents.expiration,
        documents.created_at,
        payments.description AS payment
      FROM documents
      INNER JOIN payments
        ON documents.payment = payments.id
      WHERE user_owner = ?
      AND situation = 1
      AND expiration > NOW()
      ORDER BY expiration, created_at, description`,
      { replacements: [user_id], type: QueryTypes.SELECT }
    );

    res.status(200).send(data);
  }),

  closeDocument: asyncErrorHandler(async (req: Request, res: Response) => {
    const token = req.get('Authorization')?.split(' ')[1];
    const decoded: any = jwt.verify(
      token as string,
      jwtConfig.secret as Secret
    );
    const user_id = decoded.id;
    const document_id = Number(req.params.id);

    await db.query(
      'UPDATE documents SET situation = 2 WHERE user_owner = ? AND id = ?',
      { replacements: [user_id, document_id], type: QueryTypes.UPDATE }
    );

    res.status(200).send({});
  }),

  totalRegistered: asyncErrorHandler(async (req: Request, res: Response) => {
    const token = req.get('Authorization')?.split(' ')[1];
    const decoded: any = jwt.verify(
      token as string,
      jwtConfig.secret as Secret
    );
    const user_id = decoded.id;

    const [data, _meta] = await db.query(
      'SELECT SUM(value) AS total FROM documents WHERE user_owner = ? AND situation != 3',
      { replacements: [user_id], type: QueryTypes.SELECT }
    );

    res.status(200).send(data);
  }),

  totalClosed: asyncErrorHandler(async (req: Request, res: Response) => {
    const token = req.get('Authorization')?.split(' ')[1];
    const decoded: any = jwt.verify(
      token as string,
      jwtConfig.secret as Secret
    );
    const user_id = decoded.id;

    const [data, _meta] = await db.query(
      'SELECT SUM(value) AS total FROM documents WHERE user_owner = ? AND situation = 2',
      { replacements: [user_id], type: QueryTypes.SELECT }
    );

    res.status(200).send(data);
  }),

  totalOpen: asyncErrorHandler(async (req: Request, res: Response) => {
    const token = req.get('Authorization')?.split(' ')[1];
    const decoded: any = jwt.verify(
      token as string,
      jwtConfig.secret as Secret
    );
    const user_id = decoded.id;

    const [data, _meta] = await db.query(
      'SELECT SUM(value) AS total FROM documents WHERE user_owner = ? AND situation = 1',
      { replacements: [user_id], type: QueryTypes.SELECT }
    );

    res.status(200).send(data);
  }),

  today: asyncErrorHandler(async (req: Request, res: Response) => {
    const token = req.get('Authorization')?.split(' ')[1];
    const decoded: any = jwt.verify(
      token as string,
      jwtConfig.secret as Secret
    );
    const user_id = decoded.id;

    const data = await db.query(
      `SELECT
        documents.id,
        documents.description,
        documents.value,
        documents.expiration,
        documents.created_at,
        payments.description AS payment
      FROM documents
      INNER JOIN payments
        ON documents.payment = payments.id
      WHERE user_owner = ?
      AND situation = 1
      AND expiration <= NOW()
      ORDER BY expiration, created_at, description`,
      { replacements: [user_id], type: QueryTypes.SELECT }
    );

    res.status(200).send(data);
  }),

  totalToday: asyncErrorHandler(async (req: Request, res: Response) => {
    const token = req.get('Authorization')?.split(' ')[1];
    const decoded: any = jwt.verify(
      token as string,
      jwtConfig.secret as Secret
    );
    const user_id = decoded.id;

    const [data, _meta] = await db.query(
      'SELECT SUM(value) AS total FROM documents WHERE user_owner = ? AND situation = 1 AND expiration <= NOW()',
      { replacements: [user_id], type: QueryTypes.SELECT }
    );

    res.status(200).send(data);
  }),

  getDocument: asyncErrorHandler(async (req: Request, res: Response) => {
    const token = req.get('Authorization')?.split(' ')[1];
    const decoded: any = jwt.verify(
      token as string,
      jwtConfig.secret as Secret
    );
    const user_id = decoded.id;
    const doc_id = req.params.id;

    const [document] = await db.query(
      `SELECT * FROM documents WHERE user_owner = ? AND id = ?`,
      { replacements: [user_id, doc_id], type: QueryTypes.SELECT }
    );

    if (!document)
      throw new NotFoundError(`Documento com id ${doc_id} não encontrado`);

    res.status(200).send(document);
  }),

  editDocument: asyncErrorHandler(async (req: Request, res: Response) => {
    const token = req.get('Authorization')?.split(' ')[1];
    const decoded: any = jwt.verify(
      token as string,
      jwtConfig.secret as Secret
    );
    const user_id = decoded.id;
    const doc_id = req.params.id;

    const body = req.body;
    body.value = stringToNumber(body.value);

    const data = await db.query(
      `UPDATE documents SET description = ?, value = ?, expiration = ?, payment = ?, situation = ? WHERE id = ? AND user_owner = ?`,
      {
        replacements: [
          body.description,
          body.value,
          body.expiration,
          body.payment,
          body.situation,
          doc_id,
          user_id,
        ],
        type: QueryTypes.UPDATE,
      }
    );

    res.status(200).send(data);
  }),
};
