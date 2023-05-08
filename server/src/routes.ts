import { Router } from 'express';

import controller from './controllers';
import jwtAuth from './middlewares/jwtAuth';
import validate from './middlewares/validateSchema';
import schemas from './utils/schemas';

const router = Router();

// SESSÃO
router.post('/register', validate(schemas.register), controller.register);
router.post('/login', validate(schemas.login), controller.login);
router.get('/session/verify', jwtAuth, controller.verifySession);

// FORMAS DE PAGAMENTO
router.get('/payments', jwtAuth, controller.listPayments);

// SITUAÇÕES
router.get('/situations', jwtAuth, controller.listSituations);

// DOCUMENTOS
router.post(
  '/documents',
  validate(schemas.createDocument),
  jwtAuth,
  controller.createDocument
);
router.get('/documents', jwtAuth, controller.listDocuments);

export default router;
