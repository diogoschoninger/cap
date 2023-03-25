import { Router } from 'express'

import PaymentMethods from '../controllers/PaymentMethods.js'

const router = Router()

router
	.get('/', PaymentMethods.getAll)
	.get('/:id', PaymentMethods.getOne)
	.post('/', PaymentMethods.new)
	.put('/:id', PaymentMethods.update)
	.delete('/:id', PaymentMethods.delete)

export default router
