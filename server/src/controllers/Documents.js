import Document from "../models/Document.js";

export default {
  async getAll(req, res) {
    await Document.findAll()
      .then((documents) => {
        res.json({ success: true, documents }).end();
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
    if (
      !req.body.description ||
      !req.body.expiration ||
      !req.body.value ||
      !req.body.payment_method ||
      !req.body.situation ||
      req.body.description === "" ||
      req.body.expiration === "" ||
      req.body.value === "" ||
      req.body.payment_method === "" ||
      req.body.situation === ""
    ) {
      return res
        .json({
          error: true,
          message:
            "Necessário campos 'description', 'expiration', 'value', 'payment_method' e 'situation' não vazios.",
        })
        .end();
    }

    await Document.create({
      description: req.body.description.toUpperCase(),
      expiration: req.body.expiration,
      value: req.body.value,
      payment_method: req.body.payment_method,
      situation: req.body.situation,
    })
      .then((document) => {
        res.json({ success: true, document }).end();
      })
      .catch((err) => {
        res
          .json({
            error: true,
            err,
          })
          .end();
      });
  },

  async update(req, res) {
    if (
      !req.body.description ||
      !req.body.expiration ||
      !req.body.value ||
      !req.body.payment_method ||
      !req.body.situation ||
      req.body.description === "" ||
      req.body.expiration === "" ||
      req.body.value === "" ||
      req.body.payment_method === "" ||
      req.body.situation === ""
    ) {
      return res
        .json({
          error: true,
          message:
            "Necessário campos 'description', 'expiration', 'value', 'payment_method' e 'situation' não vazios.",
        })
        .end();
    }

    await Document.findByPk(req.params.id)
      .then((document) => {
        if (!document) {
          return Promise.reject("ID inválido");
        }

        document.description = req.body.description.toUpperCase();
        document.expiration = req.body.expiration;
        document.value = req.body.value;
        document.payment_method = req.body.payment_method;
        document.situation = req.body.situation;

        return document.save();
      })
      .then((document) => {
        res
          .json({
            success: true,
            document,
          })
          .end();
      })
      .catch((err) => {
        res
          .json({
            error: true,
            err,
          })
          .end();
      });
  },

  async delete(req, res) {
    await Document.findByPk(req.params.id)
      .then((document) => document.destroy())
      .then((document) => {
        res
          .json({
            success: true,
            document,
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
