import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import PengajuanSurat from "./ContentReportModel.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const RiwayatSurat = db.define(
	"riwayat_surat",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		pengajuan_surat_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: [["dinilai", "belum"]],
			},
		},
		status_baca_user: {
			type: DataTypes.ENUM("belum_dibaca", "dibaca"),
			defaultValue: "belum_dibaca",
		},
		status_baca_admin: {
			type: DataTypes.ENUM("belum_dibaca", "dibaca"),
			defaultValue: "belum_dibaca",
		},
		status_baca_kepala: {
			type: DataTypes.ENUM("belum_dibaca", "dibaca"),
			defaultValue: "belum_dibaca",
		},
		keterangan: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		tgl_perubahan: {
			type: DataTypes.DATE,
			defaultValue: Sequelize.NOW,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
);

// Relasi ke PengajuanSurat dan User
PengajuanSurat.hasMany(RiwayatSurat, {
	foreignKey: "pengajuan_surat_id",
	// onDelete: "RESTRICT",
});
RiwayatSurat.belongsTo(PengajuanSurat, { foreignKey: "pengajuan_surat_id" });

User.hasMany(RiwayatSurat, { foreignKey: "user_id" });
RiwayatSurat.belongsTo(User, { foreignKey: "user_id" });

export default RiwayatSurat;
