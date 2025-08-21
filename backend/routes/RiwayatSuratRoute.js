import express from "express";
import {
	getRiwayatSurat,
	// getPengajuanSuratById,
	// createPengajuanSurat,
	// updatePengajuanSurat,
	// deletePengajuanSurat,
	getRiwayatNotifikasi,
	updateStatusBaca,
} from "../controllers/RiwayatSurat.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/riwayatsurat", verifyUser, getRiwayatSurat);
router.get("/riwayatsuratnotifikasi", verifyUser, getRiwayatNotifikasi);
router.patch("/riwayatsurat/:id/baca", verifyUser, updateStatusBaca);
// router.get("/pengajuansurat/:id", verifyUser, getPengajuanSuratById);
// router.post("/pengajuansurat", verifyUser, createPengajuanSurat);
// router.patch("/pengajuansurat/:id", v erifyUser, updatePengajuanSurat);
// router.delete("/pengajuansurat/:id", verifyUser, deletePengajuanSurat);

export default router;
