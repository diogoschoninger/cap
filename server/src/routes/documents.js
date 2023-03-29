import { Router } from 'express'

import Documents from '../controllers/Documents.js'

const router = Router()

router
	.post('/', Documents.new)
	.get('/', Documents.list)
	.get('/:id', Documents.get)
	.put('/:id', Documents.update)
	.delete('/:id', Documents.delete)

export default router
