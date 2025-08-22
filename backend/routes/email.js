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
		subject: "🎉 Selamat! Anda Lolos Seleksi TruBers 🚀",
		html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #E63946; text-align: center;">🎉 Selamat! Anda Lolos Seleksi TruBers 🚀</h2>
        
        <p>Halo,</p>
        <p>Dengan bangga kami umumkan bahwa Anda telah <strong>dinyatakan lolos seleksi TruBers</strong>! 👏</p>
        <p>Saatnya Kamu Jadi <strong>Trust Builder Telkomsel</strong>! Dari bikin konten keren, dapat pengalaman berharga, hingga dikenal lebih luas—ini kesempatan emas buat unjuk gigi di dunia digital.</p>

        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.URL_FRONTEND}" 
             style="background-color: #E63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
            🔑 Login ke Akun Anda
          </a>
        </div>

        <p style="text-align: center; font-size: 14px; color: #555;">
          Silakan login untuk mulai perjalanan seru Anda bersama TruBers ✨
        </p>

        <p>Salam hangat,</p>
        <p><strong>Tim TruBers</strong></p>
      </div>
    `,
	};

	try {
		await transporter.sendMail(mailOptions);
		res.status(200).json({ message: `Email berhasil dikirim ke ${email}` });
	} catch (error) {
		console.error("Error sending email:", error);
		res.status(500).json({ error: "Gagal mengirim email" });
	}
});

export default router;
