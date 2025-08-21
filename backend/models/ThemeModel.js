import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Theme = db.define(
	"theme",
	{
		uuid: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		status: {
			type: DataTypes.ENUM("aktif", "tidak aktif"),
			allowNull: false,
			defaultValue: "aktif",
		},
	},
	{
		freezeTableName: true,
	}
);

export default Theme;
