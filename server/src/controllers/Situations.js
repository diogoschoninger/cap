import Situation from '../models/Situation.js'

export default {
	getAll(req, res) {
		Situation.findAll()
			.then(situations => 
				res.status(200).send({ situations }))
			.catch(error =>
				res.status(500).send({ message: error.original.sqlMessage }))
	},

	getOne(req, res) {
		Situation.findByPk(req.params.id)
			.then(situation =>
				res.status(200).send({ situation }))
			.catch(_error =>
				res.status(400).send({ message: "Invalid ID" }))
	},

	new(req, res) {
		if (!req.body.description || req.body.description === '')
			return res.status(400).send({ message: "Required non-empty field: {'description'}" })

		Situation.create({ description: req.body.description })
			.then(situation =>
				res.status(201).send({ situation }))
			.catch(error =>
				res.status(500).send({ message: error.original.sqlMessage }))
	},

	update(req, res) {
		if (!req.body.description || req.body.description === '')
			return res.status(400).send({ message: "Required non-empty field: {'description'}" })

		Situation.findByPk(req.params.id)
			.then(situation => {
				situation.description = req.body.description

				return situation.save()
			})
			.then(situation =>
				res.status(200).send({ situation }))
			.catch(_error =>
				res.status(400).json({ message: 'Invalid ID' }))
	},

	delete(req, res) {
		Situation.findByPk(req.params.id)
			.then(situation =>
				situation.destroy())
			.then(_situation =>
				res.status(204).send())
			.catch(_error =>
				res.status(400).send({ message: 'Invalid ID' }))
	},
};
