import PaymentMethod from '../models/PaymentMethod.js'

export default {
	getAll(req, res) {
		PaymentMethod.findAll()
			.then(paymentMethods => 
				res.status(200).send({ paymentMethods }))
			.catch(error =>
				res.status(500).send({ message: error.original.sqlMessage }))
	},

	new(req, res) {
		if (!req.body.description || req.body.description === '')
			return res.status(400).send({ message: "Required non-empty field: {'description'}" })

		PaymentMethod.create({ description: req.body.description })
			.then(paymentMethod =>
				res.status(201).send({ paymentMethod }))
			.catch(error =>
				res.status(500).send({ message: error.original.sqlMessage }))
	},

	update(req, res) {
		if (!req.body.description || req.body.description === '')
			return res.status(400).send({ message: "Required non-empty field: {'description'}" })

		PaymentMethod.findByPk(req.params.id)
			.then(paymentMethod => {
				paymentMethod.description = req.body.description

				return paymentMethod.save()
			})
			.then(paymentMethod =>
				res.status(200).send({ paymentMethod }))
			.catch(_error =>
				res.status(400).json({ message: 'Invalid ID' }))
	},

	delete(req, res) {
		PaymentMethod.findByPk(req.params.id)
			.then(paymentMethod =>
				paymentMethod.destroy())
			.then(_paymentMethod =>
				res.status(204).send())
			.catch(_error =>
				res.status(400).send({ message: 'Invalid ID' }))
	},
};
