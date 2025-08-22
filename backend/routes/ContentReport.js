import express from "express";
import {
	getContentReport,
	getContentReportById,
	createContentReport,
	updateContentReportById,
	updateUrlPostinganByUUID,
	deleteContentReport,
	getContentReportUsers,
	getAllUsersWithContents,
	getContentReportByPostRank,
} from "../controllers/ContentReport.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/ContentReport", verifyUser, getContentReport);
router.get("/ContentReportByUserRank", getAllUsersWithContents);
router.get("/ContentReportByPostRank", getContentReportByPostRank);
router.get("/ContentReportuser", verifyUser, adminOnly, getContentReportUsers);
router.get("/ContentReport/:uuid", verifyUser, getContentReportById);
router.patch(
	"/ContentReport/status/:uuid",
	verifyUser,
	updateUrlPostinganByUUID
);
router.post("/ContentReport", verifyUser, createContentReport);
router.put(
	"/ContentReport/edit/:uuid",
	verifyUser,
	adminOnly,
	updateContentReportById
);
router.delete(
	"/ContentReport/:uuid",
	verifyUser,
	adminOnly,
	deleteContentReport
);

export default router;
