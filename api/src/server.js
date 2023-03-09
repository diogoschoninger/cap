import dotenv from "dotenv";
import express from "express";

import sequelize from "./database.js";
import router from "./router.js";

const app = express();

dotenv.config();

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  next();
});

app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log("Servidor rodando na porta " + process.env.PORT);
});

(async () => {
  try {
    await sequelize.sync();
    console.log("Banco de dados sincronizado!");
  } catch (error) {
    console.log(error);
  }
})();
