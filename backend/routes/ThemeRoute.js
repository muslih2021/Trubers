import express from "express";
import {
	getActiveThemes,
	createTheme,
	updateTheme,
	deleteTheme,
	getThemeById,
	getAllThemes,
} from "../controllers/ThemeController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/theme", verifyUser, getActiveThemes);
router.get("/allThemes", getAllThemes);
router.post("/theme", verifyUser, adminOnly, createTheme);
router.put("/theme/:id", verifyUser, adminOnly, updateTheme);
router.delete("/theme/:id", verifyUser, adminOnly, deleteTheme);
router.get("/theme/:id", verifyUser, getThemeById);

export default router;
