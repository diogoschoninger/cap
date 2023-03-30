import asyncErrorHandler from '../middlewares/async-error.js'
import Document from '../models/Document.js'
import { NotFoundError, ClientDataError } from '../utils/errors.js'

export default {
	new: asyncErrorHandler(async (req, res) => {
		if (
			!req.body.description ||
			!req.body.expiration ||
			!req.body.payment_method ||
			!req.body.situation ||
			req.body.description === '' ||
			req.body.expiration === '' ||
			req.body.payment_method === '' ||
			req.body.situation === ''
		)
			return Promise.reject(new ClientDataError("'description', 'expiration', 'payment_method', 'situation'"))

		const document = await Document.create({
			description: req.body.description.toUpperCase(),
			expiration: req.body.expiration,
			value: req.body.value,
			payment_method: req.body.payment_method,
			situation: req.body.situation,
		})
		
		if (!document)
			return Promise.reject(Error(document))
		
		res.status(201).send({ document })
	}),
	
	list: asyncErrorHandler(async (req, res) => {
		const documents = await Document.findAll()
		
		res.status(200).send({ documents })
	}),

	get: asyncErrorHandler(async (req, res) => {
		const document = await Document.findByPk(req.params.id)

		if (!document)
			return Promise.reject(new NotFoundError({
				resourceName: 'user',
				resourceIdentifier: req.params.id
			}))

		res.status(200).send({ document })
	}),

	update: asyncErrorHandler(async (req, res) => {
		const document = await Document.findByPk(req.params.id)

		if (!document)
			return Promise.reject(new NotFoundError({
				resourceName: 'user',
				resourceIdentifier: req.params.id
			}))
		
		if (
			!req.body.description ||
			!req.body.expiration ||
			!req.body.payment_method ||
			!req.body.situation ||
			req.body.description === '' ||
			req.body.expiration === '' ||
			req.body.payment_method === '' ||
			req.body.situation === ''
		)
			return Promise.reject(new ClientDataError("'description', 'expiration', 'payment_method', 'situation'"))
		
		document.description = req.body.description.toUpperCase()
		document.expiration = req.body.expiration
		document.value = req.body.value
		document.payment_method = req.body.payment_method
		document.situation = req.body.situation

		document.save()

		res.status(200).send({ document })
	}),

	delete: asyncErrorHandler(async (req, res) => {
		const document = await Document.findByPk(req.params.id)

		if (!document)
			return Promise.reject(new NotFoundError({
				resourceName: 'user',
				resourceIdentifier: req.params.id
			}))

		document.destroy()
		
		res.status(204).send({})
	}),
}
