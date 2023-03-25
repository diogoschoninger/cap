import { Router } from 'express'

import Situations from '../controllers/Situations.js'

const router = Router()

router
	.get('/', Situations.getAll)
	.post('/', Situations.new)
	.put('/:id', Situations.update)
	.delete('/:id', Situations.delete)

export default router
