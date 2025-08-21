import express from "express";
import {
	validasiPengajuanSurat,
	getValidasiSuratById,
	getAllValidasiSurat,
} from "../controllers/ValidasiSurat.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/validasisurat/", verifyUser, adminOnly, getAllValidasiSurat);
router.get("/validasisurat/:uuid", verifyUser, adminOnly, getValidasiSuratById);
router.post("/validasisurat", verifyUser, adminOnly, validasiPengajuanSurat);

export default router;
