import ContentReport from "../models/ContentReportModel.js";
import Theme from "../models/ThemeModel.js";
import User from "../models/UserModel.js";
import { Op, fn, col } from "sequelize";
import webpush from "web-push";
import Subscription from "../models/SubscriptionModel.js";
import { sendEmail } from "./emailService.js";
import { v4 as uuidv4 } from "uuid";
import { getTiktokData, getInstagramData } from "./scraper.js";
import { downloadImage } from "./downloadHelper.js";
import fs from "fs";
import path from "path";
import cron from "node-cron";

export const getContentReport = async (req, res) => {
	const search = req.query.search_query || "";
	const page = parseInt(req.query.page) || 0;
	const limit = parseInt(req.query.limit) || 10;
	const offset = limit * page;
	const selectedStatus = req.query.status || "Semua";
	const startDate = req.query.start_date;
	const endDate = req.query.end_date;
	const filterUserId = req.query.userId;
	const allowedSortFields = [
		"id",
		"url_postingan",
		"likes",
		"comments",
		"video_views",
		"description_caption",
		"score",
		"themeId",
		"createdAt",
		"updatedAt",
	];
	const sort = allowedSortFields.includes(req.query.sort)
		? req.query.sort
		: "id";
	const order = ["ASC", "DESC"].includes(req.query.order?.toUpperCase())
		? req.query.order.toUpperCase()
		: "DESC";

	try {
		let whereClause = {};
		// Hanya ada dua status: "dinilai" dan "belum"
		if (selectedStatus !== "Semua") {
			whereClause.status = selectedStatus;
		}

		// Filter tanggal
		if (startDate && endDate) {
			whereClause.createdAt = {
				[Op.between]: [new Date(startDate), new Date(endDate)],
			};
		}
		if (req.query.themeId) {
			whereClause.themeId = parseInt(req.query.themeId);
		}

		// Filter userId
		if (req.role === "admin") {
			if (filterUserId) {
				whereClause.userId = filterUserId;
			}
		} else {
			// User biasa hanya bisa lihat data sendiri
			whereClause.userId = req.userId;
		}

		// Pencarian
		if (search) {
			whereClause = {
				...whereClause,
				[Op.or]: [
					{ "$user.name$": { [Op.like]: `%${search}%` } },
					{ description_caption: { [Op.like]: `%${search}%` } },
				],
			};
		}

		// Include hanya user
		const includeOptions = [
			{
				model: User,
				attributes: ["name", "email", "linkmedsos", "url_foto_profile"],
				required: false,
			},
		];

		const totalRows = await ContentReport.count({
			where: whereClause,
			include: includeOptions,
		});
		const totalPage = Math.ceil(totalRows / limit);

		const response = await ContentReport.findAll({
			where: whereClause,
			attributes: [
				"id",
				"uuid",
				"status",
				"alasan",
				"createdAt",
				"updatedAt",
				"likes",
				"comments",
				"video_views",
				"url_postingan",
				"description_caption",
				"score",
				"themeId",
				"url_display_foto",
				"user.name",
			],
			include: includeOptions,
			offset,
			limit,
			order: [[sort, order]],
		});

		res.status(200).json({
			response,
			page,
			limit,
			totalRows,
			totalPage,
		});
	} catch (error) {
		console.error("Error getContentReport:", error);
		res.status(500).json({ msg: error.message });
	}
};

export const getContentReportById = async (req, res) => {
	const { uuid } = req.params;

	try {
		const pengajuan = await ContentReport.findOne({
			where: { uuid },
			include: [{ model: User, attributes: ["id", "name", "email"] }],
		});

		if (!pengajuan) {
			return res.status(404).json({ msg: "Pengajuan content tidak ditemukan" });
		}

		// 🔐 Batasi akses jika bukan admin
		const isAdmin = req.role === "admin";
		const isOwner = pengajuan.user?.id === req.userId;

		if (!isAdmin && !isOwner) {
			return res
				.status(403)
				.json({ msg: "Anda tidak berhak mengakses content ini." });
		}

		res.json({
			id: pengajuan.id,
			uuid: pengajuan.uuid,
			status: pengajuan.status,
			likes: pengajuan.likes,
			comments: pengajuan.comments,
			video_views: pengajuan.video_views,
			description_caption: pengajuan.description_caption,
			owner: pengajuan.owner,
			score: pengajuan.score,
			url_postingan: pengajuan.url_postingan,
			alasan: pengajuan.alasan,
			themeId: pengajuan.themeId,
			user: pengajuan.user,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: "Terjadi kesalahan pada server." });
	}
};

export const createContentReport = async (req, res) => {
	const { url_postingan, detail, themeId } = req.body;

	try {
		const userPembuat = await User.findOne({ where: { id: req.userId } });

		if (!userPembuat) {
			return res.status(404).json({ msg: "User tidak ditemukan" });
		}

		// Validasi tema
		const selectedTheme = await Theme.findOne({
			where: { id: themeId, status: "aktif" },
		});
		if (!selectedTheme) {
			return res.status(400).json({ msg: "Tema tidak valid atau tidak aktif" });
		}

		// Tentukan status pengajuan
		const statusPengajuan = "belum";

		// Inisialisasi data scraping
		let scrapingData = null;
		let urlThumbnail = null;
		let likes = 0;
		let comments = 0;
		let video_views = 0;
		let description_caption = null;
		let usernamePostingan = null;

		if (url_postingan.includes("instagram.com")) {
			scrapingData = await getInstagramData(url_postingan);
			if (!scrapingData) {
				return res.status(400).json({ msg: "Tolong cek URL Anda (Instagram)" });
			}

			likes = scrapingData.like_count;
			comments = scrapingData.comment_count;
			video_views = scrapingData.video_play_count;
			description_caption = scrapingData.caption || null;
			usernamePostingan = scrapingData.username || null;

			if (scrapingData.thumbnail_src) {
				urlThumbnail = await downloadImage(scrapingData.thumbnail_src, req);
			}
		} else if (
			url_postingan.includes("tiktok.com") ||
			url_postingan.includes("vt.tiktok.com")
		) {
			scrapingData = await getTiktokData(url_postingan);
			if (!scrapingData) {
				return res.status(400).json({ msg: "Tolong cek URL Anda (TikTok)" });
			}

			likes = scrapingData.digg_count;
			comments = scrapingData.comment_count;
			video_views = scrapingData.play_count;
			description_caption = scrapingData.desc || null;
			usernamePostingan = scrapingData.username || null;

			if (scrapingData.cover) {
				urlThumbnail = await downloadImage(scrapingData.cover, req);
			}
		} else {
			// URL tidak termasuk Instagram atau TikTok
			return res
				.status(400)
				.json({ msg: "URL tidak valid, hanya Instagram atau TikTok" });
		}

		// 🔎 Validasi nama akun vs username postingan
		if (
			usernamePostingan &&
			userPembuat.nama_akun.toLowerCase() !== usernamePostingan.toLowerCase()
		) {
			return res.status(400).json({
				msg: "Nama anda tidak cocok dengan nama orang yang memposting",
				your_name: userPembuat.nama_akun,
				post_username: usernamePostingan,
			});
		}

		// Buat pengajuan
		const pengajuan = await ContentReport.create({
			uuid: uuidv4(),
			userId: req.userId,
			status: statusPengajuan,
			url_postingan,
			likes,
			comments,
			description_caption,
			video_views,
			detail,
			url_display_foto: urlThumbnail,
			themeId: selectedTheme.id, // simpan tema
		});

		res.status(201).json({ msg: "Berhasil", pengajuan });
	} catch (error) {
		console.error("Error saat membuat pengajuan content:", error);

		// 🔎 Tangani error unique constraint
		if (error.name === "SequelizeUniqueConstraintError") {
			return res.status(400).json({ msg: "Konten sudah ada" });
		}

		res.status(500).json({ msg: "Terjadi kesalahan saat membuat pengajuan" });
	}
};

export const updateUrlPostinganByUUID = async (req, res) => {
	try {
		const { uuid } = req.params;
		const { url_postingan, detail } = req.body;
		let scrapingData = null;
		let urlThumbnail = null;
		let likes = 0;
		let comments = 0;
		let video_views = 0;
		let description_caption = null;
		let usernamePostingan = null;

		if (!url_postingan) {
			return res.status(400).json({ msg: "url_postingan wajib diisi" });
		}

		// Cari data berdasarkan role
		const whereClause = { uuid };
		if (req.role !== "admin" && req.role !== "KepalaDesa") {
			whereClause.userId = req.userId;
		}

		const pengajuan = await ContentReport.findOne({ where: whereClause });
		if (!pengajuan) {
			return res.status(404).json({ msg: "Data tidak ditemukan" });
		}

		// Ambil data user pembuat (untuk validasi nama akun)
		const userPembuat = await User.findOne({ where: { id: pengajuan.userId } });
		if (!userPembuat) {
			return res.status(404).json({ msg: "User tidak ditemukan" });
		}

		// Scraping berdasarkan domain
		if (url_postingan.includes("instagram.com")) {
			scrapingData = await getInstagramData(url_postingan);

			likes = scrapingData.like_count || 0;
			comments = scrapingData.comment_count || 0;
			video_views = scrapingData.video_play_count || 0;
			description_caption = scrapingData.caption || null;
			usernamePostingan = scrapingData.username || null;

			if (scrapingData.thumbnail_src) {
				urlThumbnail = await downloadImage(scrapingData.thumbnail_src, req);
			}
		} else if (
			url_postingan.includes("tiktok.com") ||
			url_postingan.includes("vt.tiktok.com")
		) {
			scrapingData = await getTiktokData(url_postingan);

			likes = scrapingData.digg_count || 0;
			comments = scrapingData.comment_count || 0;
			video_views = scrapingData.play_count || 0;
			description_caption = scrapingData.desc || null;
			usernamePostingan = scrapingData.username || null;
			if (scrapingData.cover) {
				urlThumbnail = await downloadImage(scrapingData.cover, req);
			}
		} else {
			return res
				.status(400)
				.json({ msg: "URL tidak valid, hanya Instagram atau TikTok" });
		}

		// 🔎 Validasi nama akun vs username postingan
		if (
			usernamePostingan &&
			userPembuat.nama_akun.toLowerCase() !== usernamePostingan.toLowerCase()
		) {
			return res.status(400).json({
				msg: "Nama anda tidak cocok dengan nama orang yang memposting",
				your_name: userPembuat.nama_akun,
				post_username: usernamePostingan,
			});
		}

		// Update field sesuai hasil scraping
		pengajuan.url_postingan = url_postingan;
		pengajuan.likes = likes;
		pengajuan.comments = comments;
		pengajuan.video_views = video_views;
		pengajuan.description_caption = description_caption;
		pengajuan.detail = detail || pengajuan.detail;
		pengajuan.url_display_foto = urlThumbnail || pengajuan.url_display_foto;

		await pengajuan.save();

		return res.status(200).json({
			msg: "URL postingan berhasil diperbarui",
			pengajuan,
		});
	} catch (error) {
		console.error("Error saat update url_postingan:", error);

		// 🔎 Tangani error unique constraint dari DB
		if (error.name === "SequelizeUniqueConstraintError") {
			return res.status(400).json({ msg: "Konten sudah ada" });
		}

		return res
			.status(500)
			.json({ msg: "Terjadi kesalahan saat update url_postingan" });
	}
};
// admin
export const updateContentReportById = async (req, res) => {
	const { uuid } = req.params;
	const {
		url_postingan,
		likes,
		comments,
		video_views,
		description_caption,
		owner,
		score,
	} = req.body;

	try {
		// Cari pengajuan berdasarkan UUID
		const pengajuan = await ContentReport.findOne({ where: { uuid } });

		if (!pengajuan) {
			return res.status(404).json({ msg: "Pengajuan content tidak ditemukan" });
		}

		// Update data sekaligus set status menjadi "dinilai"
		await pengajuan.update({
			url_postingan,
			likes,
			comments,
			video_views,
			description_caption,
			owner,
			score,
			status: "dinilai",
		});
		// Response langsung dikirim agar user tidak menunggu proses kirim email
		res.status(200).json({
			msg: "Pengajuan content berhasil diperbarui dan status menjadi 'dinilai'",
			pengajuan,
		});
		// Ambil user yang melakukan update (opsional)
		const userPengubah = await User.findOne({ where: { id: req.userId } });
		// Ambil user pemilik pengajuan (hanya 1 user, bukan semua)
		const targetUser = await User.findOne({
			where: { id: pengajuan.userId },
		});

		// Kirim notifikasi email secara async (tidak blokir response)
		if (targetUser && targetUser.email) {
			const emailHtml = `
		<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
			<div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); padding: 20px;">
				<h2 style="color: #2196F3; margin-top: 0;">📢 Konten Anda sudah dinilai</h2>
				<p style="font-size: 15px; color: #333;">Halo <strong>${
					targetUser.name
				}</strong>,</p>
				<p style="font-size: 14px; color: #555;">
					Konten Anda telah dinilai oleh <strong>${"Pihak Trubers"}</strong>.
				</p>
				
				<div style="margin: 25px 0; text-align: center;">
					<a href="${process.env.URL_FRONTEND}/content-report"
						style="background: #2196F3; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold; display: inline-block;">
						🔍 Tinjau Konten
					</a>
				</div>

				<p style="font-size: 13px; color: #888; text-align: center; margin-top: 30px;">
					Pesan ini dikirim otomatis, mohon tidak membalas langsung.
				</p>
			</div>
		</div>
	`;

			try {
				await sendEmail(
					targetUser.email,
					"Pengajuan Konten Dinilai",
					emailHtml
				);
				console.log("📧 Email terkirim ke:", targetUser.email);
			} catch (err) {
				console.error("❌ Gagal kirim email ke:", targetUser.email, err);
			}
		}
	} catch (error) {
		console.error("❌ Error saat update pengajuan content:", error);
		res.status(500).json({
			msg: "Terjadi kesalahan saat update pengajuan content",
		});
	}
};

export const getContentReportUsers = async (req, res) => {
	try {
		const search = req.query.search_query || "";

		const users = await ContentReport.findAll({
			attributes: [],
			include: [
				{
					model: User,
					attributes: ["id", "linkmedsos", "url_foto_profile", "role", "name"],
					where: {
						[Op.or]: [
							{ name: { [Op.like]: `%${search}%` } },
							{ linkmedsos: { [Op.like]: `%${search}%` } },
						],
					},
					required: true,
				},
			],
			group: [
				"user.id",
				"user.linkmedsos",
				"user.url_foto_profile",
				"user.role",
				"user.name",
			],
			raw: true,
		});

		// Karena raw: true, user datanya ada di "user.*"
		const result = users.map((u) => ({
			id: u["user.id"],
			linkmedsos: u["user.linkmedsos"],
			name: u["user.name"],
			role: u["user.role"],
			url_foto_profile: u["user.url_foto_profile"],
		}));

		res.status(200).json(result);
	} catch (error) {
		console.error("Error getContentReportUsers:", error);
		res.status(500).json({ message: error.message });
	}
};

export const deleteContentReport = async (req, res) => {
	try {
		const report = await ContentReport.findOne({
			where: { uuid: req.params.uuid },
		});

		if (!report) {
			return res.status(404).json({ msg: "Postingan tidak ditemukan" });
		}

		// Debugging
		console.log("📸 Data report:", report.url_display_foto);

		// Hapus file gambar jika ada
		if (report.url_display_foto) {
			const filepath = path.join("public", "images", report.url_display_foto);
			console.log("🗑 Filepath yang mau dihapus:", filepath);

			if (fs.existsSync(filepath)) {
				fs.unlinkSync(filepath);
				console.log("✅ File berhasil dihapus");
			} else {
				console.log("⚠️ File tidak ditemukan, skip delete");
			}
		}

		// Hapus data report
		await ContentReport.destroy({ where: { id: report.id } });

		res.status(200).json({ msg: "Postingan berhasil dihapus" });
	} catch (error) {
		console.error("❌ Error saat delete postingan:", error);
		res.status(500).json({ msg: "Terjadi kesalahan saat menghapus postingan" });
	}
};

// Fungsi untuk update scraping berdasarkan 1 row
const scrapeAndUpdate = async (row, req) => {
	try {
		let scrapingData = null;
		let likes = 0;
		let comments = 0;
		let video_views = 0;
		let description_caption = null;

		const url_postingan = row.url_postingan;

		if (url_postingan.includes("instagram.com")) {
			scrapingData = await getInstagramData(url_postingan);
			likes = scrapingData.like_count || 0;
			comments = scrapingData.comment_count || 0;
			video_views = scrapingData.video_play_count || 0;
			description_caption = scrapingData.caption || null;

			// 🔴 gambar tidak diupdate lagi
		} else if (
			url_postingan.includes("tiktok.com") ||
			url_postingan.includes("vt.tiktok.com")
		) {
			scrapingData = await getTiktokData(url_postingan);
			likes = scrapingData.digg_count || 0;
			comments = scrapingData.comment_count || 0;
			video_views = scrapingData.play_count || 0;
			description_caption = scrapingData.desc || null;

			// 🔴 gambar tidak diupdate lagi
		}

		// Update ke DB (tanpa ganti gambar)
		row.likes = likes;
		row.comments = comments;
		row.video_views = video_views;
		row.description_caption = description_caption;

		await row.save();
		console.log(`✅ Data berhasil diupdate: ${row.uuid}`);
	} catch (err) {
		console.error(`❌ Gagal update ${row.uuid}:`, err.message);
	}
};

// Fungsi utama update seluruh row
export const updateAllScrapingData = async (req, res) => {
	try {
		const allReports = await ContentReport.findAll();

		console.log(`📌 Memulai update ${allReports.length} data scraping...`);

		for (let i = 0; i < allReports.length; i++) {
			const row = allReports[i];
			await scrapeAndUpdate(row, req);

			// jeda 30 detik tiap update agar tidak overload
			if (i < allReports.length - 1) {
				await new Promise((resolve) => setTimeout(resolve, 30000));
			}
		}

		if (res) {
			return res.status(200).json({
				msg: "Semua data scraping berhasil diperbarui",
				total: allReports.length,
			});
		}
	} catch (error) {
		console.error("❌ Error saat updateAllScrapingData:", error);
		if (res) {
			return res
				.status(500)
				.json({ msg: "Terjadi kesalahan saat updateAllScrapingData" });
		}
	}
};

// format: detik menit jam hari-bulan bulan hari-dlm-minggu
// cron.schedule("*/60 * * * * *", async () => {
// 	console.log("⏰ Cronjob 20 detik jalan...");
// 	await updateAllScrapingData({});
// });

// Jadwalkan cron job (4x sehari = tiap 6 jam sekali)
cron.schedule("0 */6 * * *", async () => {
	console.log("⏰ Cronjob scraping dimulai...");
	await updateAllScrapingData({});
});

// cron.schedule("* * * * *", async () => {
// 	console.log("⏰ Cronjob test jalan...");
// 	await updateAllScrapingData({});
// });
// format: detik menit jam hari-bulan bulan hari-dlm-minggu
// cron.schedule("*/20 * * * * *", async () => {
// 	console.log("⏰ Cronjob 20 detik jalan...");
// 	await updateAllScrapingData({});
// });

export const getAllUsersWithContents = async (req, res) => {
	try {
		const orderBy = req.query.orderBy || "total"; // total, likes, comments, views, score

		// hitung total agregat, filter role != 'admin'
		const users = await User.findAll({
			where: {
				role: { [Op.ne]: "admin" }, // hanya tampilkan user yang bukan admin
			},
			attributes: [
				"id",
				"name",
				"uuid",
				"nama_akun",
				"url_foto_profile",
				[fn("SUM", col("contentreports.likes")), "totalLikes"],
				[fn("SUM", col("contentreports.comments")), "totalComments"],
				[fn("SUM", col("contentreports.video_views")), "totalViews"],
				[fn("SUM", col("contentreports.score")), "totalScore"],
			],
			include: [
				{
					model: ContentReport,
					attributes: [
						"id",
						"url_postingan",
						"likes",
						"comments",
						"video_views",
						"score",
					],
					required: false,
				},
			],
			group: ["users.id"],
		});

		// konversi ke JSON untuk manipulasi JS
		const usersJSON = users.map((user) => user.toJSON());

		// sort dynamic
		usersJSON.sort((a, b) => {
			if (orderBy === "likes") return b.totalLikes - a.totalLikes;
			if (orderBy === "comments") return b.totalComments - a.totalComments;
			if (orderBy === "views") return b.totalViews - a.totalViews;
			if (orderBy === "score") return b.totalScore - a.totalScore;
			// default: total = likes + comments + views
			const totalA =
				(a.totalLikes ?? 0) + (a.totalComments ?? 0) + (a.totalViews ?? 0);
			const totalB =
				(b.totalLikes ?? 0) + (b.totalComments ?? 0) + (b.totalViews ?? 0);
			return totalB - totalA;
		});

		res.status(200).json(usersJSON);
	} catch (error) {
		console.error("Error getAllUsersWithContents:", error);
		res.status(500).json({ msg: error.message });
	}
};
export const getContentReportByPostRank = async (req, res) => {
	try {
		const orderBy = req.query.orderBy || "total"; // total, likes, comments, views, score

		// ambil semua konten + user yang submit
		const contents = await ContentReport.findAll({
			include: [
				{
					model: User,
					attributes: ["id", "name", "nama_akun", "url_foto_profile"],
					where: { role: { [Op.ne]: "admin" } }, // hanya user bukan admin
				},
			],
			attributes: [
				"id",
				"url_postingan",
				"likes",
				"comments",
				"video_views",
				"score",
			],
		});

		// konversi ke JSON
		const contentsJSON = contents.map((c) => c.toJSON());

		// sorting dinamis
		contentsJSON.sort((a, b) => {
			switch (orderBy) {
				case "likes":
					return (b.likes ?? 0) - (a.likes ?? 0);
				case "comments":
					return (b.comments ?? 0) - (a.comments ?? 0);
				case "views":
					return (b.video_views ?? 0) - (a.video_views ?? 0);
				case "score":
					return (b.score ?? 0) - (a.score ?? 0);
				case "total":
				default:
					const totalA =
						(a.likes ?? 0) + (a.comments ?? 0) + (a.video_views ?? 0);
					const totalB =
						(b.likes ?? 0) + (b.comments ?? 0) + (b.video_views ?? 0);
					return totalB - totalA;
			}
		});

		res.status(200).json(contentsJSON);
	} catch (error) {
		console.error("Error getContentReportByPostRank:", error);
		res.status(500).json({ msg: error.message });
	}
};

///New
export const getContentReportByUserUuid = async (req, res) => {
	try {
		const { uuid } = req.params;
		const { themeId } = req.query;

		let themeFilter = {};

		// Kalau themeId ada dan bukan "semua"
		if (themeId && themeId !== "semua") {
			themeFilter.themeId = {
				[Op.in]: themeId.split(",").map((id) => parseInt(id)),
			};
		}

		const user = await User.findOne({
			where: { uuid },
			attributes: [
				"uuid",
				"name",
				"email",
				"linkmedsos",
				"sosmed_utama",
				"nama_akun",
				"jumlah_follower_terakhir",
				"kota",
				"interest_minat",
				"sekolah",
				"kelas",
				"url_foto_profile",
			],
			include: [
				{
					model: ContentReport,
					where: Object.keys(themeFilter).length ? themeFilter : undefined,
					required: false,
					include: [{ model: Theme }],
					order: [["createdAt", "DESC"]],
				},
			],
		});

		if (!user) {
			return res.status(404).json({ message: "User tidak ditemukan" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error("Error getContentReportByUserUuid:", error);
		res.status(500).json({ message: error.message });
	}
};
