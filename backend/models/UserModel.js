import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define(
	"users",
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
				len: [3, 100],
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		role: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: "user",
			validate: {
				notEmpty: false,
			},
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		linkmedsos: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				notEmpty: false,
			},
		},
		// kolom baru
		sosmed_utama: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		nama_akun: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		jumlah_follower_terakhir: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		interest_minat: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		kota: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		sekolah: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		kelas: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		tanda_tangan: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		url_tanda_tangan: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		foto_ktp: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		url_foto_ktp: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		foto_profile: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		url_foto_profile: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		email_notifikasi: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		resetToken: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		resetTokenExpire: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		freezeTableName: true,
	}
);
export default User;
