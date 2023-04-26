import { NextFunction, Request, Response, response } from 'express';

import { ValidationError } from '../utils/errors';

const responseMappers: any = {
  ValidationError: (error: ValidationError) => ({
    status: 400,
    body: {
      status: 400,
      error: ValidationError.name,
      message: error.message,
      cause: error.validations,
    },
  }),

  default: (error: Error) => ({
    status: 500,
    body: {
      status: 500,
      error: error.name ?? 'UnexpectedError',
      message: error.message,
    },
  }),
};

export default () =>
  (error: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);
    const mapper = responseMappers[error.name] ?? responseMappers.default;

    const { status, body } = mapper(error);

    res.status(status).send(body);
  };
