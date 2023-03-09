import Situation from "../models/Situation.js";

export default {
  async getAll(req, res) {
    const situations = await Situation.findAll();

    res.json({ situations }).end();
  },
};
