import { DataTypes, Model } from "sequelize";

import sequelize from "../database.js";

class Situation extends Model {}

Situation.init(
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

export default Situation;
