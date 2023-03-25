import { DataTypes, Model } from 'sequelize'

import sequelize from '../database.js'

class Document extends Model {}

Document.init(
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
		},
		expiration: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		value: {
			type: DataTypes.DECIMAL(11, 2),
			allowNull: false,
		},
	},
	{ sequelize, paranoid: true }
)

export default Document
