import express from "express";
import {
	Login,
	LogOut,
	Me,
	updateMe,
	updatePassword,
} from "../controllers/Auth.js";

const router = express.Router();

router.get("/me", Me);
router.post("/login", Login);
router.patch("/updateMe", updateMe);
router.patch("/update-password", updatePassword);
router.delete("/logout", LogOut);

export default router;
