import { NextFunction, Request, Response } from 'express';

import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from '../utils/errors';

const responseMappers: any = {
  ValidationError: (error: ValidationError) => ({
    status: 400,
    error: 'Erro de validação',
    message: error.message,
    validations: error.validations.map((v: any) => v.message),
  }),

  NotFoundError: (error: NotFoundError) => ({
    status: 404,
    error: 'Recurso não encontrado',
    message: error.message,
  }),

  AuthenticationError: (error: AuthenticationError) => ({
    status: 401,
    error: 'Erro de autenticação',
    message: error.message,
  }),

  AuthorizationError: (error: AuthorizationError) => ({
    status: 403,
    error: 'Erro de autorização',
    message: error.message,
  }),

  default: (error: Error) => ({
    status: 500,
    error: 'Erro inesperado',
    message: error.message,
  }),
};

export default () =>
  (error: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);

    const mapper = responseMappers[error.name] ?? responseMappers.default;

    const { status, ...body } = mapper(error);

    res.status(status).send(body);
  };
