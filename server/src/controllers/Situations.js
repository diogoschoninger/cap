import Situation from "../models/Situation.js";

export default {
  async getAll(req, res) {
    await Situation.findAll()
      .then((situations) => {
        res.json({ success: true, situations }).end();
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
          message: "Necessário campo 'description' não vazio.",
        })
        .end();
    }

    await Situation.create({
      description: req.body.description,
    })
      .then((situation) => {
        res.json({ success: true, situation }).end();
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
    if (!req.body.description || req.body.description === "") {
      return res
        .json({
          error: true,
          message: "Necessário campo 'description' não vazio.",
        })
        .end();
    }

    await Situation.findByPk(req.params.id)
      .then((situation) => {
        situation.description = req.body.description;
        return situation.save();
      })
      .then((situation) => {
        res
          .json({
            success: true,
            situation,
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
    await Situation.findByPk(req.params.id)
      .then((situation) => situation.destroy())
      .then((situation) => {
        res
          .json({
            success: true,
            situation,
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
