import express from "express";
import {
	subscribeUser,
	sendNotification,
} from "../controllers/pushController.js";

const router = express.Router();

router.post("/subscribe", subscribeUser);
router.post("/send", sendNotification);

export default router;
