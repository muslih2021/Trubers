import PengajuanSurat from "../models/ContentReportModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import RiwayatSurat from "../models/RiwayatSuratModel.js";

export const getRiwayatSurat = async (req, res) => {
	try {
		// Filter sesuai role
		const whereCondition =
			req.role === "admin" || req.role === "KepalaDesa"
				? {}
				: { user_id: req.userId };

		// Ambil riwayat tanpa jenis surat
		const response = await RiwayatSurat.findAll({
			where: whereCondition,
			attributes: ["id", "status", "keterangan", "tgl_perubahan"],
			include: [
				{
					model: User,
					attributes: ["name", "email"],
				},
				{
					model: PengajuanSurat,
					attributes: ["id", "uuid", "status", "alasan"],
				},
			],
			order: [["tgl_perubahan", "DESC"]],
		});

		res.status(200).json(response);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: error.message });
	}
};

export const getRiwayatNotifikasi = async (req, res) => {
	const page = parseInt(req.query.page) || 0;
	const limit = parseInt(req.query.limit) || 10;
	const offset = limit * page;

	const role = req.role;
	const userId = req.userId;
	const statusBaca = req.query.status || "Semua";
	let allowedStatuses = [];
	let bacaField = "";

	if (role === "user") {
		allowedStatuses = ["menunggu_ttd", "ditolak", "selesai"];
		bacaField = "status_baca_user";
	} else if (role === "admin") {
		allowedStatuses = ["diproses", "dibatalkan", "selesai"];
		bacaField = "status_baca_admin";
	} else if (role === "KepalaDesa") {
		allowedStatuses = ["menunggu_ttd", "dibatalkan"];
		bacaField = "status_baca_kepala";
	}

	const whereClause = {
		status: { [Op.in]: allowedStatuses },
	};

	if (role === "user") {
		whereClause.user_id = userId;
	}

	if (statusBaca !== "Semua") {
		whereClause[bacaField] = statusBaca;
	}

	try {
		const totalRows = await RiwayatSurat.count({ where: whereClause });
		const totalPage = Math.ceil(totalRows / limit);

		console.log("Role:", role);
		console.log("Status Baca Field:", bacaField);
		console.log("Status Baca Filter:", statusBaca);
		console.log("Total Rows:", totalRows);

		const riwayat = await RiwayatSurat.findAll({
			where: whereClause,
			order: [["tgl_perubahan", "DESC"]],
			limit,
			offset,
			include: [
				{
					model: User,
					attributes: ["id", "name", "email"],
				},
				{
					model: PengajuanSurat,
					attributes: ["uuid", "status"],
				},
			],
		});

		res.status(200).json({
			response: riwayat,
			page,
			limit,
			totalRows,
			totalPage,
		});
	} catch (error) {
		console.error("Error getRiwayatNotifikasi:", error);
		res.status(500).json({ msg: error.message });
	}
};
export const updateStatusBaca = async (req, res) => {
	const { id } = req.params;
	const role = req.role;

	try {
		const riwayat = await RiwayatSurat.findByPk(id);

		if (!riwayat) {
			return res.status(404).json({ msg: "Riwayat surat tidak ditemukan" });
		}

		// Tentukan kolom yang perlu diupdate berdasarkan peran
		let updateField = null;

		if (role === "user") {
			updateField = "status_baca_user";
		} else if (role === "admin") {
			updateField = "status_baca_admin";
		} else if (role === "KepalaDesa") {
			updateField = "status_baca_kepala";
		} else {
			return res
				.status(403)
				.json({ msg: "Peran tidak dikenali untuk update status baca" });
		}

		// Update kolom baca yang sesuai
		await riwayat.update({ [updateField]: "dibaca" });

		res.status(200).json({ msg: "Status baca berhasil diperbarui" });
	} catch (error) {
		console.error("updateStatusBaca error:", error);
		res.status(500).json({ msg: "Gagal memperbarui status baca" });
	}
};
