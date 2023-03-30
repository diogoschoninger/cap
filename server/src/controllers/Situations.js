import asyncErrorHandler from '../middlewares/async-error.js'
import Situation from '../models/Situation.js'
import { NotFoundError, ClientDataError } from '../utils/errors.js'

export default {
	new: asyncErrorHandler(async (req, res) => {
		if (!req.body.description || req.body.description === '')
			return Promise.reject(new ClientDataError("'description'"))

		const situation = await Situation.create({ description: req.body.description.toUpperCase() })
		
		if (!situation)
			return Promise.reject(Error(situation))

		res.status(201).send({ situation })
	}),

	list: asyncErrorHandler(async (req, res) => {
		const situations = await Situation.findAll()
		
		res.status(200).send({ situations })
	}),

	get: asyncErrorHandler(async (req, res) => {
		const situation = await Situation.findByPk(req.params.id)

		if (!situation)
			return Promise.reject(new NotFoundError({
				resourceName: 'situation',
				resourceIdentifier: req.params.id
			}))

		res.status(200).send({ situation })
	}),

	update: asyncErrorHandler(async (req, res) => {
		const situation = await Situation.findByPk(req.params.id)

		if (!situation)
			return Promise.reject(new NotFoundError({
				resourceName: 'situation',
				resourceIdentifier: req.params.id
			}))

		if (!req.body.description || req.body.description === '')
			return Promise.reject(new ClientDataError("'description'"))

		situation.description = req.body.description.toUpperCase()
		
		situation.save()
		
		res.status(200).send({ situation })
	}),

	delete: asyncErrorHandler(async (req, res) => {
		const situation = await Situation.findByPk(req.params.id)

		if (!situation)
			return Promise.reject(new NotFoundError({
				resourceName: 'situation',
				resourceIdentifier: req.params.id
			}))
		
		situation.destroy()

		res.status(204).send({})
	}),
};
