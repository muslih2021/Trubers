import User from "../models/UserModel.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";

export const Login = async (req, res) => {
	const user = await User.findOne({
		where: {
			email: req.body.email,
		},
	});
	if (!user) return res.status(404).json({ msg: "User tidak di temukan" });
	if (!user.isVerified) {
		return res.status(403).json({
			msg: "Akun belum diverifikasi. Silakan verifikasi terlebih dahulu.",
		});
	}
	const match = await argon2.verify(user.password, req.body.password);
	if (!match) return res.status(400).json({ msg: "Password Anda Salah" });
	req.session.userId = user.uuid;
	if (req.body.rememberMe) {
		req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 hari
	} else {
		req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 1 hari
	}
	const uuid = user.uuid;
	const name = user.name;
	const email = user.email;
	const role = user.role;
	res.status(200).json({
		msg: "Login berhasil!",
		uuid,
		name,
		email,
		role,
	});
};

export const Me = async (req, res) => {
	if (!req.session.userId) {
		return res.status(401).json({ msg: "Mohon login ke akun anda" });
	}
	const user = await User.findOne({
		attributes: [
			"uuid",
			"id",
			"name",
			"email",
			"linkmedsos",
			"role",
			"foto_profile",
			"url_foto_profile",
			"email_notifikasi",
			"sosmed_utama",
			"nama_akun",
			"jumlah_follower_terakhir",
			"interest_minat",
			"kota",
			"sekolah",
			"kelas",
		],
		where: {
			uuid: req.session.userId,
		},
	});
	if (!user) return res.status(404).json({ msg: "User tidak di temukan" });
	res.status(200).json(user);
};

export const LogOut = async (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.error("Gagal destroy session:", err);
			return res.status(400).json({ msg: "tidak dapat logout" });
		}
		console.log("Session berhasil dihapus:", req.sessionID);
		res.status(200).json({ msg: "Anda telah logout" });
	});
};
export const updateMe = async (req, res) => {
	if (!req.session.userId) {
		return res.status(401).json({ msg: "Mohon login ke akun Anda" });
	}

	try {
		const user = await User.findOne({
			where: { uuid: req.session.userId },
		});

		if (!user) {
			return res.status(404).json({ msg: "User tidak ditemukan" });
		}

		const { name, email, linkmedsos } = req.body;

		let fileNameProfile = user.foto_profile;
		let urlProfile = user.url_foto_profile;

		// Upload Foto Profile
		if (req.files && req.files.foto_profile) {
			const file = req.files.foto_profile;
			const ext = path.extname(file.name).toLowerCase();
			const currentDate = new Date();
			const dateString = currentDate.toISOString().split("T")[0];
			const timeString = currentDate
				.toTimeString()
				.split(" ")[0]
				.replace(/:/g, "-");
			fileNameProfile = `${dateString}-${timeString}-${file.md5}${ext}`;
			urlProfile = `${req.protocol}://${req.get(
				"host"
			)}/images/${fileNameProfile}`;

			if (![".png", ".jpg", ".jpeg"].includes(ext)) {
				return res.status(422).json({ msg: "File Foto Profile tidak valid" });
			}
			if (file.data.length > 5000000) {
				return res
					.status(422)
					.json({ msg: "File harus lebih kecil dari 5 MB" });
			}

			if (user.foto_profile) {
				const oldFilePath = `./public/images/${user.foto_profile}`;
				if (fs.existsSync(oldFilePath)) {
					fs.unlinkSync(oldFilePath);
				}
			}

			await file.mv(`./public/images/${fileNameProfile}`, (err) => {
				if (err) return res.status(500).json({ msg: err.message });
			});
		}

		// Update data user
		user.name = name || user.name;
		user.email = email || user.email;
		user.linkmedsos = linkmedsos || user.linkmedsos;
		user.foto_profile = fileNameProfile || user.foto_profile;
		user.url_foto_profile = urlProfile || user.url_foto_profile;

		await user.save();
		res.status(200).json({
			msg: "Profil berhasil diperbarui",
		});
	} catch (error) {
		res.status(500).json({ msg: "Terjadi kesalahan", error: error.message });
	}
};

// route: /update-password
export const updatePassword = async (req, res) => {
	if (!req.session.userId) {
		return res.status(401).json({ msg: "Mohon login ke akun Anda" });
	}

	const { currentPassword, newPassword } = req.body;

	try {
		const user = await User.findOne({ where: { uuid: req.session.userId } });
		if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

		const match = await argon2.verify(user.password, currentPassword);
		if (!match) return res.status(400).json({ msg: "Password lama salah" });

		user.password = await argon2.hash(newPassword);
		await user.save();

		res.status(200).json({ msg: "Password berhasil diubah" });
	} catch (error) {
		res
			.status(500)
			.json({ msg: "Gagal mengubah password", error: error.message });
	}
};
