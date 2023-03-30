import asyncErrorHandler from '../middlewares/async-error.js'
import PaymentMethod from '../models/PaymentMethod.js'
import { NotFoundError, ClientDataError } from '../utils/errors.js'

export default {
	new: asyncErrorHandler(async (req, res) => {
		if (!req.body.description || req.body.description === '')
			return Promise.reject(new ClientDataError("'description'"))

		const paymentMethod = await PaymentMethod.create({ description: req.body.description.toUpperCase() })
		
		if (!paymentMethod)
			return Promise.reject(Error(paymentMethod))
		
		res.status(201).send({ paymentMethod })
	}),

	list: asyncErrorHandler(async (req, res) => {
		const paymentMethods = await PaymentMethod.findAll()
		
		res.status(200).send({ paymentMethods })
	}),

	get: asyncErrorHandler(async (req, res) => {
		const paymentMethod = await PaymentMethod.findByPk(req.params.id)

		if (!paymentMethod)
			return Promise.reject(new NotFoundError({
				resourceName: 'paymentMethod',
				resourceIdentifier: req.params.id
			}))

		res.status(200).send({ paymentMethod })
	}),

	update: asyncErrorHandler(async (req, res) => {
		const paymentMethod = await PaymentMethod.findByPk(req.params.id)

		if (!paymentMethod)
			return Promise.reject(new NotFoundError({
				resourceName: 'paymentMethod',
				resourceIdentifier: req.params.id
			}))

		if (!req.body.description || req.body.description === '')
			return Promise.reject(new ClientDataError("'description'"))

		paymentMethod.description = req.body.description.toUpperCase()
		
		paymentMethod.save()
		
		res.status(200).send({ paymentMethod })
	}),

	delete: asyncErrorHandler(async (req, res) => {
		const paymentMethod = await PaymentMethod.findByPk(req.params.id)

		if (!paymentMethod)
			return Promise.reject(new NotFoundError({
				resourceName: 'paymentMethod',
				resourceIdentifier: req.params.id
			}))
		
		paymentMethod.destroy()

		res.status(204).send({})
	}),
};
