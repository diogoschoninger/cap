import { Router } from 'express'

import Documents from '../controllers/Documents.js'

const router = Router()

router
	.get('/', Documents.getAll)
	.post('/', Documents.new)
	.put('/:id', Documents.update)
	.delete('/:id', Documents.delete)

export default router
