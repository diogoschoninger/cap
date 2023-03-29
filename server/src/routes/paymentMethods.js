import { Router } from 'express'

import PaymentMethods from '../controllers/PaymentMethods.js'

const router = Router()

router
	.post('/', PaymentMethods.new)
	.get('/', PaymentMethods.list)
	.get('/:id', PaymentMethods.get)
	.put('/:id', PaymentMethods.update)
	.delete('/:id', PaymentMethods.delete)

export default router
