import sequelize from "./database.js";
import dotenv from "dotenv";
import express from "express";

import router from "./router.js";
import Document from "./models/Document.js";
import PaymentMethod from "./models/PaymentMethod.js";
import Situation from "./models/Situation.js";

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
    Document.belongsTo(PaymentMethod, {
      constraint: true,
      foreignKey: {
        name: "payment_method",
        allowNull: false,
      },
    });
    Document.belongsTo(Situation, {
      constraint: true,
      foreignKey: {
        name: "situation",
        allowNull: false,
      },
    });

    await sequelize.sync();
    console.log("Banco de dados sincronizado!");
  } catch (error) {
    console.log(error);
  }
})();
