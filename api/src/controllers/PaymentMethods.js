import PaymentMethod from "../models/PaymentMethod.js";

export default {
  async getAll(req, res) {
    const paymentMethods = await PaymentMethod.findAll();

    res.json({ paymentMethods }).end();
  },
};
