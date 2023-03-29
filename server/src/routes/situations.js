import { Router } from 'express'

import Situations from '../controllers/Situations.js'

const router = Router()

router
	.post('/', Situations.new)
	.get('/', Situations.list)
	.get('/:id', Situations.get)
	.put('/:id', Situations.update)
	.delete('/:id', Situations.delete)

export default router
