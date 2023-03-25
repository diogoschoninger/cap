import { DataTypes, Model } from 'sequelize'

import sequelize from '../database.js'

class PaymentMethod extends Model {}

PaymentMethod.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{ sequelize, paranoid: true }
)

export default PaymentMethod
