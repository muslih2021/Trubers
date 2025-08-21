import webpush from "./webpush.js"; // <- file ini mengatur VAPID key & config
import Subscription from "../models/SubscriptionModel.js";

export const subscribeUser = async (req, res) => {
	try {
		const { endpoint, expirationTime, keys, userId } = req.body;

		const existing = await Subscription.findOne({
			where: { userId },
		});

		if (existing) {
			// Sudah ada langganan, update jika endpoint berubah
			if (existing.endpoint !== endpoint) {
				await existing.update({
					endpoint,
					expirationTime,
					p256dh: keys.p256dh,
					auth: keys.auth,
				});
				return res.status(200).json({ message: "Subscription diperbarui." });
			}

			return res.status(200).json({ message: "Sudah terdaftar." });
		}

		// Belum ada, simpan baru
		await Subscription.create({
			userId,
			endpoint,
			expirationTime,
			p256dh: keys.p256dh,
			auth: keys.auth,
		});

		res.status(201).json({ message: "Berhasil subscribe" });
	} catch (error) {
		console.error("❌ Gagal simpan:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// ✅ Mengirim notifikasi ke semua subscription yang tersimpan
export const sendNotification = async (req, res) => {
	try {
		const subscriptions = await Subscription.findAll();

		if (!subscriptions || subscriptions.length === 0) {
			return res
				.status(400)
				.json({ message: "Tidak ada subscription tersimpan" });
		}

		const payload = JSON.stringify({
			title: "Halo!",
			body: "Kamu menekan tombol notifikasi 🎉",
		});

		for (const sub of subscriptions) {
			const pushSubscription = {
				endpoint: sub.endpoint,
				expirationTime: sub.expirationTime,
				keys: {
					p256dh: sub.p256dh,
					auth: sub.auth,
				},
			};

			try {
				await webpush.sendNotification(pushSubscription, payload);
				console.log("✅ Notifikasi terkirim ke:", sub.endpoint);
			} catch (err) {
				console.error("❌ Gagal kirim ke satu endpoint:", err.message);
			}
		}

		res.status(200).json({ message: "Notifikasi dikirim ke semua user" });
	} catch (error) {
		console.error("❌ Gagal kirim notifikasi:", error);
		res.status(500).json({ message: "Gagal kirim notifikasi" });
	}
};
