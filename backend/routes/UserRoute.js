import express from "express";
import {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	forgotPassword,
	resetPassword,
	getResetPasswordPage,
	deleteManyUsers,
	updateStatusMany,
	updateEmailNotifikasi,
} from "../controllers/Users.js";
import {
	verifyUser,
	// adminOnly,
	adminOnly,
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", verifyUser, adminOnly, getUsers);
router.get("/users/:id", verifyUser, adminOnly, getUserById);
router.post("/users", verifyUser, adminOnly, createUser);
router.post("/regis", createUser);
router.patch("/users/:id", verifyUser, adminOnly, updateUser);
router.delete("/users/:id", verifyUser, adminOnly, deleteUser);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", getResetPasswordPage);
router.post("/reset-password/:token", resetPassword);
router.post("/users/delete-many", deleteManyUsers, adminOnly);
router.post("/users/update-status-many", updateStatusMany, adminOnly);
router.patch("/user/notifikasi/:id", updateEmailNotifikasi);

export default router;
