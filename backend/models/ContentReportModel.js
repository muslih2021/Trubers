import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Theme from "./ThemeModel.js";

const { DataTypes } = Sequelize;

const ContentReport = db.define(
	"contentreport",
	{
		uuid: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: [["dinilai", "belum"]],
			},
		},
		url_postingan: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				isUrl: true,
			},
		},
		likes: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		comments: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		video_views: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		description_caption: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		owner: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		score: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		display_foto: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		url_display_foto: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		alasan: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
	},
	{
		freezeTableName: true,
	}
);

// Relasi ke Users
Users.hasMany(ContentReport);
ContentReport.belongsTo(Users, { foreignKey: "userId" });

// Relasi ke Theme
ContentReport.belongsTo(Theme, { foreignKey: "themeId" });
Theme.hasMany(ContentReport, { foreignKey: "themeId" });

export default ContentReport;
