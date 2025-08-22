import Theme from "../models/ThemeModel.js";
import { Op } from "sequelize";

export const getActiveThemes = async (req, res) => {
	const search = req.query.search_query || "";
	const page = parseInt(req.query.page) || 0;
	const limit = parseInt(req.query.limit) || 10;
	const offset = limit * page;
	const sort = ["id", "name", "status", "createdAt", "updatedAt"].includes(
		req.query.sort
	)
		? req.query.sort
		: "id";
	const order = ["ASC", "DESC"].includes(req.query.order?.toUpperCase())
		? req.query.order.toUpperCase()
		: "ASC";

	try {
		let whereClause = {};

		// Role check
		if (req.role !== "admin") {
			// User biasa hanya bisa lihat tema aktif
			whereClause.status = "aktif";
		}

		// Pencarian nama tema
		if (search) {
			whereClause = {
				...whereClause,
				name: { [Op.like]: `%${search}%` },
			};
		}

		const totalRows = await Theme.count({ where: whereClause });
		const totalPage = Math.ceil(totalRows / limit);

		const themes = await Theme.findAll({
			where: whereClause,
			offset,
			limit,
			order: [[sort, order]],
		});

		res.status(200).json({
			response: themes,
			page,
			limit,
			totalRows,
			totalPage,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: "Gagal mengambil tema", error: error.message });
	}
};

// Update existing theme
export const updateTheme = async (req, res) => {
	const { id } = req.params;
	const { name, status } = req.body;

	try {
		const theme = await Theme.findByPk(id);
		if (!theme) {
			return res.status(404).json({ msg: "Tema tidak ditemukan" });
		}

		await theme.update({
			name: name ?? theme.name,
			status: status ?? theme.status,
		});

		res.json({ msg: "Tema berhasil diperbarui", data: theme });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: "Gagal memperbarui tema" });
	}
};
// DELETE /theme/:id
export const deleteTheme = async (req, res) => {
	try {
		const { id } = req.params;

		// Cari theme berdasarkan ID
		const theme = await Theme.findByPk(id);
		if (!theme) {
			return res.status(404).json({ msg: "Tema tidak ditemukan" });
		}

		// Hapus theme
		await theme.destroy();

		res.status(200).json({ msg: "Tema berhasil dihapus" });
	} catch (error) {
		console.error("Error deleting theme:", error);
		res.status(500).json({ msg: "Gagal menghapus tema", error: error.message });
	}
};

export const createTheme = async (req, res) => {
	const { name, status } = req.body;

	try {
		const newTheme = await Theme.create({
			name,
			status,
		});

		res.status(201).json({ msg: "Tema berhasil dibuat", data: newTheme });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: "Gagal membuat tema" });
	}
};

export const getThemeById = async (req, res) => {
	try {
		const { id } = req.params;

		// Cari tema berdasarkan ID
		const theme = await Theme.findByPk(id);

		if (!theme) {
			return res.status(404).json({ msg: "Tema tidak ditemukan" });
		}

		res.status(200).json({ msg: "Success", data: theme });
	} catch (error) {
		console.error("Error getting theme by ID:", error);
		res.status(500).json({ msg: "Gagal mengambil tema", error: error.message });
	}
};
