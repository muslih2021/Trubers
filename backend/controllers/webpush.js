import webpush from "web-push";

export const vapidKeys = {
	publicKey:
		"BNkkTERuAj-3d5nEPQWcXlwXxNkGLrqBuAbEDKik_wZje2ASyZXiXM2Oz4Doc_vHnNZ_4V1v-dng4NNGnrTuKME",
	privateKey: "P7-J10kRhmT8W-Rng4MqJ5SR0-cvIVuJ5gqLbGJe6YE",
};

webpush.setVapidDetails(
	"mailto:kamu@email.com",
	vapidKeys.publicKey,
	vapidKeys.privateKey
);

export default webpush;
