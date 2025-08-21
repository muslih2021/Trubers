import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import crypto from "crypto";

export const downloadImage = async (url, req) => {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error("Failed to fetch image");

		const folder = "./public/images";
		if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

		// Ambil ekstensi dari URL, default .png
		let ext = path.extname(new URL(url).pathname) || ".png";
		if (![".png", ".jpg", ".jpeg"].includes(ext)) ext = ".png";

		// Buat nama file unik: tanggal + hash
		const now = new Date();
		const dateString = now.toISOString().split("T")[0];
		const timeString = now.toTimeString().split(" ")[0].replace(/:/g, "-");
		const hash = crypto.createHash("md5").update(url).digest("hex");
		const fileName = `${dateString}-${timeString}-${hash}${ext}`;

		const filePath = path.join(folder, fileName);

		const buffer = await response.buffer();
		fs.writeFileSync(filePath, buffer);

		// Return URL bisa diakses browser
		return `${req.protocol}://${req.get("host")}/images/${fileName}`;
	} catch (err) {
		console.error("Download image error:", err);
		return null;
	}
};
