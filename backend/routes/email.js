import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

router.post("/send-email", async (req, res) => {
	const { email } = req.body;

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Verifikasi Akun Anda",
		html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #4CAF50; text-align: center;">✅ Verifikasi Akun Berhasil!</h2>
        <p>Halo,</p>
        <p>Email Anda telah diverifikasi. Anda sekarang dapat menggunakan akun Anda untuk login.</p>
        <p>Silakan klik tombol di bawah untuk masuk ke akun Anda:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.URL_FRONTEND}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Login Sekarang
          </a>
        </div>
        <p>Jika Anda tidak melakukan verifikasi ini, abaikan email ini.</p>
        <p>Terima kasih,</p>
        <p><strong>Tim Support</strong></p>
      </div>
    `,
	};

	try {
		await transporter.sendMail(mailOptions);
		res
			.status(200)
			.json({ message: `Email verifikasi berhasil dikirim ke ${email}` });
	} catch (error) {
		console.error("Error sending email:", error);
		res.status(500).json({ error: "Gagal mengirim email" });
	}
});

export default router;
