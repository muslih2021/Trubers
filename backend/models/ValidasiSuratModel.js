import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import PengajuanSurat from "./ContentReportModel.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const ValidasiSurat = db.define(
	"validasi_surat",
	{
		uuid: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		pengajuan_surat_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: PengajuanSurat,
				key: "id",
			},
		},
		admin_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Users,
				key: "id",
			},
		},
		status_validasi: {
			type: DataTypes.ENUM("divalidasi", "dikembalikan_ke_user"),
			allowNull: false,
		},
		catatan: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		tgl_validasi: {
			type: DataTypes.DATE,
			defaultValue: Sequelize.NOW,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
);
//  ValidasiSurat -> PengajuanSurat
ValidasiSurat.belongsTo(PengajuanSurat, {
	foreignKey: "pengajuan_surat_id",
	onDelete: "CASCADE",
});
PengajuanSurat.hasOne(ValidasiSurat, {
	foreignKey: "pengajuan_surat_id",
	// onDelete: "RESTRICT",
});

// ValidasiSurat -> Users (admin)
ValidasiSurat.belongsTo(Users, {
	foreignKey: "admin_id",
	as: "admin",
});
Users.hasMany(ValidasiSurat, {
	foreignKey: "admin_id",
	as: "validasiSurat",
});
export default ValidasiSurat;
