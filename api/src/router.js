import express from "express";

import Documents from "./controllers/Documents.js";
import PaymentMethods from "./controllers/PaymentMethods.js";
import Situations from "./controllers/Situations.js";

const router = express.Router();

// Rotas de documentos
router
  .get("/documents", Documents.getAll)
  .post("/documents", Documents.new)
  .put("/documents/:id", Documents.update)
  .delete("/documents/:id", Documents.delete);

// Rotas de métodos de pagamento
router
  .get("/payment-methods", PaymentMethods.getAll)
  .post("/payment-methods", PaymentMethods.new)
  .put("/payment-methods/:id", PaymentMethods.update)
  .delete("/payment-methods/:id", PaymentMethods.delete);

// Rotas de situações
router
  .get("/situations", Situations.getAll)
  .post("/situations", Situations.new)
  .put("/situations/:id", Situations.update)
  .delete("/situations/:id", Situations.delete);

export default router;
