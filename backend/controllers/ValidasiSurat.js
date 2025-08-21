import PengajuanSurat from "../models/ContentReportModel.js";
import ValidasiSurat from "../models/ValidasiSuratModel.js";
import RiwayatSurat from "../models/RiwayatSuratModel.js";
import Subscription from "../models/SubscriptionModel.js";
import { v4 as uuidv4 } from "uuid";
import webpush from "./webpush.js";
import User from "../models/UserModel.js";
import { sendEmail } from "./emailService.js";

export const validasiPengajuanSurat = async (req, res) => {
	const { pengajuanSuratId, status_validasi, catatan, score } = req.body; // tambahkan score

	try {
		// 1. Cari pengajuan surat
		const pengajuan = await PengajuanSurat.findOne({
			where: { uuid: pengajuanSuratId },
		});

		if (!pengajuan) {
			return res.status(404).json({ msg: "Pengajuan surat tidak ditemukan" });
		}

		// 2. Validasi catatan jika ditolak
		if (status_validasi === "ditolak" && (!catatan || catatan.trim() === "")) {
			return res.status(400).json({ msg: "Alasan penolakan wajib diisi." });
		}

		// 3. Cek apakah sudah pernah divalidasi (jika mau bisa update, bukan hanya create)
		const existingValidasi = await ValidasiSurat.findOne({
			where: { pengajuan_surat_id: pengajuan.id },
		});

		if (existingValidasi) {
			// update score + status + catatan
			await existingValidasi.update({
				status_validasi,
				catatan,
				score, // update score juga
				tgl_validasi: new Date(),
			});
		} else {
			// create baru
			await ValidasiSurat.create({
				uuid: uuidv4(),
				pengajuan_surat_id: pengajuan.id,
				admin_id: req.userId,
				status_validasi,
				catatan,
				score, // simpan score
				tgl_validasi: new Date(),
			});
		}

		// 4. Update status pengajuan (dan score kalau mau disimpan di pengajuan)
		const statusBaru =
			status_validasi === "divalidasi" ? "menunggu_ttd" : "ditolak";
		const updateData = { status: statusBaru, score }; // simpan score juga
		if (status_validasi === "ditolak") updateData.alasan = catatan;

		await PengajuanSurat.update(updateData, { where: { id: pengajuan.id } });

		// 5. Catat riwayat
		await RiwayatSurat.create({
			pengajuan_surat_id: pengajuan.id,
			user_id: pengajuan.userId,
			status: statusBaru,
			keterangan:
				statusBaru === "menunggu_ttd"
					? "Surat divalidasi oleh admin dan sedang menunggu tanda tangan Kepala Desa"
					: "Pengajuan Surat Anda Telah Ditolak oleh admin",
			tgl_perubahan: new Date(),
		});

		// (lanjutan kode notifikasi push, email, dsb tetap sama seperti milikmu)
		// ...

		res.status(200).json({ msg: "Validasi pengajuan berhasil diproses" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: "Gagal memproses validasi pengajuan" });
	}
};

export const getAllValidasiSurat = async (req, res) => {
	try {
		const validasiList = await ValidasiSurat.findAll({
			include: [
				{
					model: User,
					as: "admin",
					attributes: ["id", "name", "email", "role"],
				},
				{
					model: PengajuanSurat,
					attributes: ["id", "uuid", "status", "createdAt"],
					include: [
						{
							model: JenisSurat,
							attributes: ["nama_surat"],
						},
					],
				},
			],
			order: [["tgl_validasi", "DESC"]],
		});

		res.status(200).json(validasiList);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: "Gagal mengambil daftar validasi surat" });
	}
};

export const getValidasiSuratById = async (req, res) => {
	const { uuid } = req.params;

	try {
		const validasi = await ValidasiSurat.findOne({
			where: { uuid },
			include: [
				{
					model: User,
					as: "admin",
					attributes: ["id", "name", "email", "role"],
				},
				{
					model: PengajuanSurat,
					attributes: ["id", "uuid", "status", "createdAt"],
					include: [
						{
							model: JenisSurat,
							attributes: ["nama_surat"],
						},
					],
				},
			],
		});

		if (!validasi) {
			return res.status(404).json({ msg: "Validasi surat tidak ditemukan" });
		}

		res.status(200).json(validasi);
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: "Gagal mengambil data validasi surat" });
	}
};
