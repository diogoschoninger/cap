import { NextFunction, Request, Response } from 'express';

export default (handler: any) =>
  (req: Request, res: Response, next: NextFunction) =>
    handler(req, res).catch(next);
