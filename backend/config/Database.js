import { Sequelize } from "sequelize";

const db = new Sequelize("telkom_social_performance", "root", "", {
	host: "localhost",
	dialect: "mysql",
});

export default db;
