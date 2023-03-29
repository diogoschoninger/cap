import Document from '../models/Document.js'

export default {
	new(req, res) {
		let body = req.body

		if (
			!body.description ||
			!body.expiration ||
			!body.payment_method ||
			!body.situation ||
			body.description === '' ||
			body.expiration === '' ||
			body.payment_method === '' ||
			body.situation === ''
		)
			return res.status(400).send({
				message: "Required non-empty fields: {'description', 'expiration', 'payment_method', 'situation'}"
			})

		Document.create({
			description: body.description.toUpperCase(),
			expiration: body.expiration,
			value: body.value,
			payment_method: body.payment_method,
			situation: body.situation,
		})
			.then(document =>
				res.status(201).send({ document }))
			.catch(error =>
				res.status(500).send({ error }))
	},
	
	list(req, res) {
		Document.findAll()
			.then(documents =>
				res.status(200).send({ documents }))
			.catch(error =>
				res.status(500).send({ message: error.original.sqlMessage }))
	},

	get(req, res) {
		Document.findByPk(req.params.id)
			.then(document =>
				res.status(200).send({ document }))
			.catch(_error =>
				res.status(400).send({ message: "Invalid ID" }))
	},

	update(req, res) {
		let body = req.body

		if (
			!body.description ||
			!body.expiration ||
			!body.payment_method ||
			!body.situation ||
			body.description === '' ||
			body.expiration === '' ||
			body.payment_method === '' ||
			body.situation === ''
		)
			return res.status(400).send({
				message: "Required non-empty fields: {'description', 'expiration', 'payment_method', 'situation'}"
			})

		Document.findByPk(req.params.id)
			.then(document => {
				if (!document)
					return Promise.reject('Invalid ID')

				document.description = body.description.toUpperCase()
				document.expiration = body.expiration
				document.value = body.value
				document.payment_method = body.payment_method
				document.situation = body.situation

				return document.save()
			})
			.then(document =>
				res.status(200).send({ document }))
			.catch(error =>
				res.status(400).json({ error }))
	},

	delete(req, res) {
		Document.findByPk(req.params.id)
			.then(document => document.destroy())
			.then(_document =>
				res.status(204).send())
			.catch(error =>
				res.status(400).send({ message: 'Invalid ID' }))
	},
}
