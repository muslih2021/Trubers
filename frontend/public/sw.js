self.addEventListener("push", (event) => {
	const data = event.data?.json() || {};

	const options = {
		body: data.body || "Ada notifikasi baru",
		icon: "/logo.png",
		badge: "/logo.png",
		data: {
			url: data.url || "/", // Ambil langsung dari payload
		},
	};

	event.waitUntil(
		self.registration.showNotification(data.title || "Notifikasi", options)
	);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	const urlToOpen = event.notification.data?.url || "/";

	console.log("➡️ URL to open:", urlToOpen); // Tambahkan log ini untuk debug

	event.waitUntil(
		clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((clientList) => {
				for (const client of clientList) {
					if (client.url === urlToOpen && "focus" in client) {
						return client.focus();
					}
				}
				if (clients.openWindow) {
					return clients.openWindow(urlToOpen);
				}
			})
	);
});
