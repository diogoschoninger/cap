import PaymentMethod from "../models/PaymentMethod.js";

export default {
  async getAll(req, res) {
    await PaymentMethod.findAll()
      .then((paymentMethods) => {
        res.json({ success: true, paymentMethods }).end();
      })
      .catch((err) => {
        res
          .json({
            error: true,
            errno: err.original.errno,
            message: err.original.sqlMessage,
          })
          .end();
      });
  },

  async new(req, res) {
    if (!req.body.description || req.body.description === "") {
      return res
        .json({
          error: true,
          message: "Necessário enviar um campo 'description' não vazio.",
        })
        .end();
    }

    await PaymentMethod.create({
      description: req.body.description,
    })
      .then((paymentMethod) => {
        res.json({ success: true, paymentMethod }).end();
      })
      .catch((err) => {
        res
          .json({
            error: true,
            errno: err.original.errno,
            message: err.original.sqlMessage,
          })
          .end();
      });
  },

  async update(req, res) {
    if (!req.params.id) {
      return res
        .json({
          error: true,
          message: "Necessário um ID na URL.",
        })
        .end();
    } else if (!req.body.description || req.body.description === "") {
      return res
        .json({
          error: true,
          message: "Necessário enviar um campo 'description' não vazio.",
        })
        .end();
    }

    await PaymentMethod.findByPk(req.params.id)
      .then((paymentMethod) => {
        paymentMethod.description = req.body.description;
        return paymentMethod.save();
      })
      .then((paymentMethod) => {
        res
          .json({
            success: true,
            paymentMethod,
          })
          .end();
      })
      .catch((err) => {
        res
          .json({
            error: true,
            message: "ID inválido.",
          })
          .end();
      });
  },

  async delete(req, res) {
    await PaymentMethod.findByPk(req.params.id)
      .then((paymentMethod) => paymentMethod.destroy())
      .then((paymentMethod) => {
        res
          .json({
            success: true,
            paymentMethod,
          })
          .end();
      })
      .catch((err) => {
        res
          .json({
            error: true,
            message: "ID inválido.",
          })
          .end();
      });
  },
};
