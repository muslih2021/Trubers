import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Users from "./pages/Users.jsx";
import Notifikasi from "./pages/Notifikasi.jsx";
import Regis from "./components/Auth/Regris.jsx";
import Profile from "./pages/Profile.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";
import Report from "./pages/Report.jsx";
import ReportAdmin from "./pages/ReportAdmin.jsx";
import Home from "./pages/guest/Home.jsx";
import Leaderboard from "./pages/guest/Leaderboard.jsx";
import ThemeAdmin from "./pages/ThemeAdmin.jsx";

function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/leaderboard" element={<Leaderboard />} />
					<Route path="/login" element={<Login />} />
					<Route path="/regis" element={<Regis />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/notifikasi" element={<Notifikasi />} />
					<Route path="/content-report" element={<Report />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/reset-password/:token" element={<ResetPassword />} />
					{/* Admin */}
					<Route path="/users" element={<Users />} />
					<Route path="/content-report-all" element={<ReportAdmin />} />
					<Route path="/theme-all" element={<ThemeAdmin />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
