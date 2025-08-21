import { DataTypes } from "sequelize";
import db from "../config/Database.js"; // sesuaikan dengan lokasi konfigurasi database kamu
import User from "./UserModel.js";
const Subscription = db.define(
	"Subscription",
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		endpoint: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		expirationTime: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		p256dh: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		auth: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: "subscriptions", // opsional: nama tabel di database
	}
);
Subscription.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Subscription, { foreignKey: "userId", as: "subscriptions" });
export default Subscription;
