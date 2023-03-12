import express from "express";

import Documents from "./controllers/Documents.js";
import PaymentMethods from "./controllers/PaymentMethods.js";
import Situations from "./controllers/Situations.js";

const router = express.Router();

// Rotas de documentos
router.get("/documents", Documents.getAll);

// Rotas de métodos de pagamento
router
  .get("/payment-methods", PaymentMethods.getAll)
  .post("/payment-methods", PaymentMethods.new);

// Rotas de situações
router.get("/situations", Situations.getAll);

export default router;
