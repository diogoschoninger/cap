import sequelize from '../database.js'
import Document from '../models/Document.js'
import PaymentMethod from '../models/PaymentMethod.js'
import Situation from '../models/Situation.js'

export default async () => {
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
}
