// src/components/ChangePasswordComponent.jsx
import React, { useState } from "react";
import { Password } from "primereact/password";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";
import { updatePassword } from "../features/authSlice";

const ChangePasswordComponent = () => {
	const dispatch = useDispatch();
	const toast = React.useRef(null);
	const [form, setForm] = useState({
		currentPassword: "",
		newPassword: "",
		confNewPassword: "",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!form.currentPassword || !form.newPassword || !form.confNewPassword) {
			toast.current.show({
				severity: "warn",
				summary: "Perhatian",
				detail: "Semua field harus diisi",
				life: 3000,
			});
			return;
		}

		if (form.newPassword !== form.confNewPassword) {
			toast.current.show({
				severity: "error",
				summary: "Gagal",
				detail: "Konfirmasi password baru tidak cocok",
				life: 3000,
			});
			return;
		}

		try {
			setLoading(true);
			await dispatch(
				updatePassword({
					currentPassword: form.currentPassword,
					newPassword: form.newPassword,
				})
			).unwrap();
			toast.current.show({
				severity: "success",
				summary: "Berhasil",
				detail: "Password berhasil diubah",
				life: 3000,
			});
			setForm({
				currentPassword: "",
				newPassword: "",
				confNewPassword: "",
			});
		} catch (error) {
			toast.current.show({
				severity: "error",
				summary: "Gagal",
				detail: error || "Gagal mengubah password",
				life: 3000,
			});
		} finally {
			setLoading(false);
		}
	};

	const footer = (
		<>
			<p className="mt-2">Saran:</p>
			<ul className="pl-3 line-height-3">
				<li>Setidaknya satu huruf kecil</li>
				<li>Setidaknya satu huruf besar</li>
				<li>Setidaknya satu angka</li>
				<li>Minimal 8 karakter</li>
			</ul>
		</>
	);

	return (
		<div className="border-round-xl Grayscale-border mt-8 mb-0 py-3 px-3 md:px-6 shadow-4 w-full">
			<Toast ref={toast} />
			<h2 className="text-title lufga">Ganti Password</h2>
			<form onSubmit={handleSubmit} className="md:my-4 flex-column flex gap-3">
				<FloatLabel>
					<Password
						name="currentPassword"
						value={form.currentPassword}
						onChange={handleChange}
						toggleMask
						feedback={false}
						inputId="currentPassword"
						className="w-full"
						autoComplete="current-password"
					/>
					<label htmlFor="currentPassword">Password Lama</label>
				</FloatLabel>

				<FloatLabel>
					<Password
						name="newPassword"
						value={form.newPassword}
						onChange={handleChange}
						toggleMask
						inputId="newPassword"
						promptLabel="Masukan kata sandi"
						weakLabel="Terlalu sederhana"
						mediumLabel="Kata sandi Menengah"
						strongLabel="Kata sandi Kuat"
						footer={footer}
						className="w-full"
						autoComplete="new-password"
					/>
					<label htmlFor="newPassword">Password Baru</label>
				</FloatLabel>

				<FloatLabel>
					<Password
						name="confNewPassword"
						value={form.confNewPassword}
						onChange={handleChange}
						toggleMask
						feedback={false}
						inputId="confNewPassword"
						className="w-full"
						autoComplete="new-password"
					/>
					<label htmlFor="confNewPassword">Konfirmasi Password Baru</label>
				</FloatLabel>

				<div className="flex justify-content-end">
					<Button
						label={loading ? "Menyimpan..." : "Ubah Password"}
						type="submit"
						disabled={loading}
						className="gradient-button lufga-semi-bold w-12 md:w-2"
					/>
				</div>
			</form>
		</div>
	);
};

export default ChangePasswordComponent;
