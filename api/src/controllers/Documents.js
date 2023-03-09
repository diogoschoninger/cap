import Document from "../models/Document.js";

export default {
  async getAll(req, res) {
    const documents = await Document.findAll();

    res.json({ documents }).end();
  },
};
