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
};
