import express from "express";
import cors from "cors";
import session from "express-session";
import FileUpload from "express-fileupload";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import SequelizeStore from "connect-session-sequelize";
import db from "./config/Database.js";
import email from "./routes/email.js";
import dotenv from "dotenv";
import RiwayatSuratRoute from "./routes/RiwayatSuratRoute.js";
import ValidasiSuratRoute from "./routes/ValidasiSuratRoute.js";
import ContentReportRoute from "./routes/ContentReport.js";
import pushRoutes from "./routes/pushRoutes.js";
import ThemeRoute from "./routes/ThemeRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
	db: db,
	checkExpirationInterval: 15 * 60 * 1000,
	expiration: 7 * 24 * 60 * 60 * 1000,
});

(async () => {
	await db.sync();
})();
(async () => {
	await db.sync({ alter: true });
	console.log("Database synchronized");
})();
app.use(
	session({
		secret: process.env.SESS_SECRET,
		resave: false,
		saveUninitialized: false,
		store: store,
		cookie: {
			secure: "auto",
			maxAge: 24 * 60 * 60 * 1000,
		},
	})
);

// middleware
app.use(
	cors({
		credentials: true,
		origin: process.env.URL_FRONTEND,
	})
);
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(UserRoute);
app.use(AuthRoute);
app.use("/api", email);
app.use(RiwayatSuratRoute);
app.use(ValidasiSuratRoute);
app.use(ContentReportRoute);
app.use(pushRoutes);
app.use(ThemeRoute);

store.sync();

app.listen(process.env.APP_PORT, () => {
	console.log("server up and running...........");
});
