import User from "../models/UserModel.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";
import { Op } from "sequelize";
dotenv.config();

export const getUsers = async (req, res) => {
	const page = parseInt(req.query.page) || 0;
	const limit = parseInt(req.query.limit) || 10;
	const search = req.query.search_query || "";
	const offset = limit * page;
	const allowedSortFields = [
		"id",
		"name",
		"email",
		"sosmed_utama",
		"nama_akun",
		"jumlah_follower_terakhir",
		"interest_minat",
		"kota",
		"sekolah",
		"kelas",
		"createdAt",
		"updatedAt",
	];
	const sort = allowedSortFields.includes(req.query.sort)
		? req.query.sort
		: "id";
	const order = ["ASC", "DESC"].includes(req.query.order?.toUpperCase())
		? req.query.order.toUpperCase()
		: "DESC";

	const role = req.query.role || "";
	const isVerified = req.query.isVerified || "";

	const totalRows = await User.count({
		where: {
			[Op.and]: [
				{
					[Op.or]: [
						{ name: { [Op.like]: `%${search}%` } },
						{ email: { [Op.like]: `%${search}%` } },
					],
				},
				...(role ? [{ role }] : []),
				...(isVerified ? [{ isVerified }] : []),
			],
		},
	});
	const totalPage = Math.ceil(totalRows / limit);
	const response = await User.findAll({
		where: {
			[Op.and]: [
				{
					[Op.or]: [
						{ name: { [Op.like]: `%${search}%` } },
						{ email: { [Op.like]: `%${search}%` } },
					],
				},
				...(role ? [{ role }] : []),
				...(isVerified ? [{ isVerified }] : []),
			],
		},
		offset: offset,
		limit: limit,
		order: [[sort, order]],
	});
	res.json({
		response: response,
		page: page,
		limit: limit,
		totalRows: totalRows,
		totalPage: totalPage,
	});
};

export const getUserById = async (req, res) => {
	try {
		const response = await User.findOne({
			where: {
				uuid: req.params.id,
			},
		});
		res.status(200).json(response);
	} catch (error) {
		console.log(error.massage);
	}
};
export const createUser = async (req, res) => {
	const {
		name,
		email,
		password,
		confPassword,
		role,
		linkmedsos,
		isVerified,
		sosmed_utama,
		nama_akun,
		jumlah_follower_terakhir,
		interest_minat,
		kota,
		sekolah,
		kelas,
	} = req.body;

	// 1️⃣ Validasi password
	if (password !== confPassword)
		return res
			.status(400)
			.json({ msg: "Password dan Confirm password tidak sama" });

	// 2️⃣ Cek email sudah ada
	const existingUser = await User.findOne({ where: { email } });
	if (existingUser)
		return res.status(400).json({ msg: "Email sudah terdaftar" });

	// 3️⃣ Hash password
	const hashPassword = await argon2.hash(password);

	// 4️⃣ Tentukan role
	let userRole = "user"; // default untuk registrasi biasa
	let verified = false; // default

	// Jika admin yang buat user via /users
	if (req.user && req.user.role === "admin") {
		if (role) userRole = role; // admin bisa atur role
		if (typeof isVerified !== "undefined") verified = isVerified; // admin bisa atur isVerified
	}

	// 6️⃣ Buat user baru
	try {
		await User.create({
			name,
			email,
			password: hashPassword,
			role: userRole,
			linkmedsos,
			isVerified: verified,
			sosmed_utama,
			nama_akun,
			jumlah_follower_terakhir,
			interest_minat,
			kota,
			sekolah,
			kelas,
		});
		res.status(201).json({ msg: "Berhasil" });
	} catch (error) {
		console.log(error.message);
		res.status(400).json({ msg: error.message });
	}
};

export const updateUser = async (req, res) => {
	const user = await User.findOne({
		where: {
			uuid: req.params.id,
		},
	});
	if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

	const {
		name,
		email,
		password,
		confPassword,
		isVerified,
		role,
		linkmedsos,

		sosmed_utama,
		nama_akun,
		jumlah_follower_terakhir,
		interest_minat,
		kota,
		sekolah,
		kelas,
	} = req.body;
	let hashPassword = user.password;

	if (password && password !== "") {
		if (password !== confPassword) {
			return res
				.status(400)
				.json({ msg: "Password dan Confirm Password tidak sama" });
		}
		hashPassword = await argon2.hash(password);
	}

	try {
		await User.update(
			{
				name,
				email,
				password: hashPassword,
				isVerified,
				role,
				linkmedsos,
				sosmed_utama,
				nama_akun,
				jumlah_follower_terakhir,
				interest_minat,
				kota,
				sekolah,
				kelas,
			},
			{
				where: {
					id: user.id,
				},
			}
		);
		res.status(200).json({ msg: "User Berhasil Diupdate" });
	} catch (error) {
		console.log(error.message);
		res.status(400).json({ msg: error.message });
	}
};

export const deleteUser = async (req, res) => {
	const user = await User.findOne({
		where: {
			uuid: req.params.id,
		},
	});
	if (!user) return res.status(404).json({ msg: "User tidak di temukan" });
	try {
		await User.destroy({
			where: {
				id: user.id,
			},
		});
		res.status(200).json({ msg: "User Berhasil Di Delete" });
	} catch (error) {
		console.log(error.massage);
		res.status(400).json({ msg: error.massage });
	}
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ where: { email } });
		if (!user) return res.status(404).json({ msg: "Email tidak terdaftar" });

		const resetToken = crypto.randomBytes(32).toString("hex");
		user.resetToken = resetToken;
		user.resetTokenExpire = new Date(Date.now() + 3600000);
		await user.save();

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});
		const resetLink = `${process.env.URL_FRONTEND}/reset-password/${resetToken}`;
		const mailOptions = {
			from: "no-reply@yourapp.com",
			to: email,
			subject: "Reset Password",
			text: `Klik link ini untuk reset password: ${resetLink}`,
		};

		await transporter.sendMail(mailOptions);

		res.json({ msg: "Email reset password telah dikirim" });
	} catch (error) {
		res.status(500).json({ msg: "Terjadi kesalahan", error: error.message });
	}
};
export const getResetPasswordPage = async (req, res) => {
	try {
		const { token } = req.params;
		const user = await User.findOne({
			where: { resetToken: token, resetTokenExpire: { [Op.gt]: new Date() } },
		});

		if (!user)
			return res
				.status(400)
				.json({ msg: "Token tidak valid atau sudah kedaluwarsa" });

		res.json({ msg: "Token valid", token });
	} catch (error) {
		res.status(500).json({ msg: "Terjadi kesalahan", error: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { password } = req.body;
		const { token } = req.params;

		const user = await User.findOne({ where: { resetToken: token } });
		if (!user) return res.status(400).json({ msg: "Token tidak valid" });

		const hashedPassword = await argon2.hash(password);

		await user.update({
			password: hashedPassword,
			resetToken: null,
			resetTokenExpire: null,
		});

		res.json({ msg: "Password berhasil direset" });
	} catch (error) {
		console.error("Error di resetPassword:", error);
		res.status(500).json({ msg: "Terjadi kesalahan", error: error.message });
	}
};

export const deleteManyUsers = async (req, res) => {
	try {
		const { ids } = req.body;
		if (!Array.isArray(ids)) {
			return res.status(400).json({ msg: "Format data tidak valid" });
		}
		await User.destroy({
			where: {
				uuid: ids,
			},
		});

		res.status(200).json({ msg: "Berhasil menghapus data" });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ msg: "Gagal menghapus data" });
	}
};

export const updateStatusMany = async (req, res) => {
	try {
		const { ids, isVerified } = req.body;
		if (!Array.isArray(ids) || typeof isVerified !== "number") {
			return res.status(400).json({ msg: "Format data tidak valid" });
		}

		await User.update(
			{ isVerified },
			{
				where: {
					uuid: ids,
				},
			}
		);

		res.status(200).json({ msg: "Status berhasil diperbarui" });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ msg: "Gagal memperbarui status" });
	}
};
export const updateEmailNotifikasi = async (req, res) => {
	try {
		const user = await User.findOne({
			where: {
				uuid: req.params.id,
			},
		});

		if (!user) {
			return res.status(404).json({ msg: "User tidak ditemukan" });
		}

		// Toggle status: jika true jadi false, jika false jadi true
		const newStatus = !user.email_notifikasi;

		await User.update(
			{ email_notifikasi: newStatus },
			{ where: { id: user.id } }
		);

		res.status(200).json({
			msg: `Notifikasi email berhasil ${
				newStatus ? "diaktifkan" : "dinonaktifkan"
			}`,
			email_notifikasi: newStatus,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: "Gagal memperbarui notifikasi email" });
	}
};
