import { DataTypes, Model } from "sequelize";

import sequelize from "../database.js";

class PaymentMethod extends Model {}

PaymentMethod.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize }
);

export default PaymentMethod;
