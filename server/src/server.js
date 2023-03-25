import express from 'express'

import syncDatabase from './utils/syncDatabase.js'
import documents from './routes/documents.js'
import paymentMethods from './routes/paymentMethods.js'
import situations from './routes/situations.js'

const app = express()

app.use(express.json())

app.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', '*')
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
	next()
})

app.use('/documents', documents)
app.use('/payment-methods', paymentMethods)
app.use('/situations', situations)

app.use('*', (req, res) => {
	res.status(404).send({ message: 'Invalid endpoint' })
})

app.listen(process.env.PORT, () => {
	console.log('Server started. Port: ' + process.env.PORT)
})

syncDatabase()
