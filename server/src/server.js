import express from 'express'

import sequelize from './database.js'
import Document from './models/Document.js'
import PaymentMethod from './models/PaymentMethod.js'
import Situation from './models/Situation.js'
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
});

(async () => {
	try {
		Document.belongsTo(PaymentMethod, {
			constraint: true,
			foreignKey: {
				name: 'payment_method',
				allowNull: false,
			},
		})

		Document.belongsTo(Situation, {
			constraint: true,
			foreignKey: {
				name: 'situation',
				allowNull: false,
			},
		})

		await sequelize.sync()
		
		console.log('Database sync.')
	} catch (error) {
		console.error(error)
	}
})()
