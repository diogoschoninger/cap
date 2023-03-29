import express from 'express'

import syncDatabase from './utils/syncDatabase.js'
import documents from './routes/documents.js'
import paymentMethods from './routes/paymentMethods.js'
import situations from './routes/situations.js'

const app = express()
const router = express.Router()

router.use(express.json())
router.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', '*')
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
	next()
})
router.use('/documents', documents)
router.use('/payment-methods', paymentMethods)
router.use('/situations', situations)

app.use('/api', router)

app.use('*', (req, res) =>
	res.status(404).send({ message: 'Invalid endpoint' }))

app.listen(process.env.PORT, () =>
	console.log('Server started. Port: ' + process.env.PORT))

syncDatabase()
