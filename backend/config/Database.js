import { Sequelize } from "sequelize";

const db = new Sequelize("ther4496_trubers", "ther4496_trubers_admin", "", {
	host: "api.trubers.id",
	dialect: "mysql",
});

export default db;
