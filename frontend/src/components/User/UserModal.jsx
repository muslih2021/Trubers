import React, {
	useState,
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import { Dialog } from "primereact/dialog";
import { Messages } from "primereact/messages";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const UserModal = forwardRef(
	(
		{ isOpen, closeModal, user, saveUser, msg, isNew, isShow, saveData },
		ref
	) => {
		const [formData, setFormData] = useState({
			name: "",
			email: "",
			linkmedsos: "",
			password: "",
			confPassword: "",
			sosmed_utama: "",
			nama_akun: "",
			jumlah_follower_terakhir: "",
			interest_minat: "",
			kota: "",
			sekolah: "",
			kelas: "",
			isVerified: false,
		});

		const msgs = useRef(null);

		useEffect(() => {
			console.log("User in modals:", user);
			if (user) {
				setFormData(user);
			}
		}, [user]);
		useImperativeHandle(ref, () => ({
			showMessage(content, severity = "error") {
				msgs.current.show([
					{
						severity,
						summary: severity === "error" ? "Error" : "Info",
						detail: content,
						sticky: true,
					},
				]);
			},
		}));

		useEffect(() => {
			if (msg && msgs.current) {
				msgs.current.show([
					{ severity: "error", summary: "Error", detail: msg, sticky: true },
				]);
			}
		}, [msg]);

		const handleChange = (e) => {
			setFormData({ ...formData, [e.target.name]: e.target.value });
		};

		useEffect(() => {
			if (!isOpen) {
				setFormData({
					name: "",
					email: "",
					linkmedsos: "",
					sosmed_utama: "",
					nama_akun: "",
					jumlah_follower_terakhir: "",
					interest_minat: "",
					kota: "",
					sekolah: "",
					kelas: "",
					password: "",
					confPassword: "",
					role: "user",
					isVerified: false,
				});
			}
		}, [isOpen]);

		const handleSubmit = (e) => {
			e.preventDefault();
			console.log("FormData sebelum submit:", formData);
			const uploadData = new FormData();
			Object.keys(formData).forEach((key) => {
				uploadData.append(key, formData[key]);
			});

			console.log("Submitting Data:", Object.fromEntries(uploadData));

			saveUser(uploadData);
		};

		if (!isOpen) return null;

		const handleToggleVerification = () => {
			const updatedStatus = !formData.isVerified;
			setFormData({ ...formData, isVerified: updatedStatus });
			saveUser({ ...formData, isVerified: updatedStatus });
		};

		const footer = (
			<>
				<Divider />
				<p className="mt-2">Saran</p>
				<ul className="pl-2 ml-2 mt-0 line-height-3">
					<li>Setidaknya satu huruf kecil</li>
					<li>Setidaknya satu huruf besar</li>
					<li>Setidaknya satu angka</li>
					<li>Minimal 8 karakter</li>
				</ul>
			</>
		);
		const roles = [
			{ name: "admin", code: "admin" },
			{ name: "User", code: "user" },
		];
		const Status = [
			{ name: "Verified", code: true },
			{ name: "Not Verified", code: false },
		];

		return (
			<div>
				<Dialog
					breakpoints={{ "960px": "75vw", "641px": "100vw" }}
					header={isNew ? "Add User" : isShow ? "View User" : "Edit User"}
					maximizable
					visible={isOpen}
					style={{ width: "50vw" }}
					onHide={closeModal}
				>
					{!isShow && (
						<form onSubmit={handleSubmit}>
							<div className="field">
								<FloatLabel className="mb-4 mt-6 w-12 fadeinleft animation-duration-500">
									<InputText
										name="name"
										required
										id="name"
										value={formData.name}
										onChange={handleChange}
										className=":p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="name">
										Name
									</label>
								</FloatLabel>
							</div>
							<div className="field">
								<FloatLabel className="mb-4 mt-6 w-12 fadeinleft animation-duration-500">
									<InputText
										name="email"
										required
										id="email"
										value={formData.email}
										onChange={handleChange}
										className=":p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="email">
										Email
									</label>
								</FloatLabel>
							</div>
							<div className="field">
								<FloatLabel className="w-12 mb-4 mt-6 fadeinright animation-duration-500">
									<InputText
										name="linkmedsos"
										required
										id="linkmedsos"
										autoComplete="new-linkmedsos"
										value={formData.linkmedsos}
										onChange={handleChange}
										className=":p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="linkmedsos">
										Link Media Sosial
									</label>
								</FloatLabel>
							</div>
							{/* SOSMED UTAMA (Dropdown) */}
							<div className="field">
								<FloatLabel className="mb-4 mt-6 w-full fadeinleft animation-duration-500">
									<Dropdown
										id="sosmed_utama"
										name="sosmed_utama"
										value={formData.sosmed_utama}
										options={[
											{ label: "Instagram", value: "instagram" },
											{ label: "TikTok", value: "tiktok" },
										]}
										placeholder="Pilih sosmed"
										className="w-full"
										onChange={(e) =>
											handleChange({
												target: { name: "sosmed_utama", value: e.value },
											})
										}
									/>
									<label htmlFor="sosmed_utama">Sosmed Utama</label>
								</FloatLabel>
							</div>

							{/* NAMA AKUN */}
							<div className="field">
								<FloatLabel className="mb-4 mt-6 w-full fadeinleft animation-duration-500">
									<InputText
										id="nama_akun"
										name="nama_akun"
										value={formData.nama_akun}
										onChange={handleChange}
										className="p-inputtext-sm md:p-inputtext-md w-full"
										required
									/>
									<label htmlFor="nama_akun">Nama Akun</label>
								</FloatLabel>
							</div>

							{/* JUMLAH FOLLOWER TERAKHIR */}
							<div className="field">
								<FloatLabel className="mb-4 mt-6 w-full fadeinleft animation-duration-500">
									<InputText
										id="jumlah_follower_terakhir"
										name="jumlah_follower_terakhir"
										value={formData.jumlah_follower_terakhir}
										onChange={handleChange}
										className="p-inputtext-sm md:p-inputtext-md w-full"
										inputMode="numeric"
									/>
									<label htmlFor="jumlah_follower_terakhir">
										Jumlah Follower Terakhir
									</label>
								</FloatLabel>
							</div>

							{/* INTEREST / MINAT */}
							<div className="field">
								<FloatLabel className="mb-4 mt-6 w-full fadeinleft animation-duration-500">
									<InputText
										id="interest_minat"
										name="interest_minat"
										value={formData.interest_minat}
										onChange={handleChange}
										className="p-inputtext-sm md:p-inputtext-md w-full"
										placeholder=""
									/>
									<label htmlFor="interest_minat">Interest / Minat</label>
								</FloatLabel>
							</div>

							{/* KOTA */}
							<div className="field">
								<FloatLabel className="mb-4 mt-6 w-full fadeinleft animation-duration-500">
									<InputText
										id="kota"
										name="kota"
										value={formData.kota}
										onChange={handleChange}
										className="p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label htmlFor="kota">Kota</label>
								</FloatLabel>
							</div>

							{/* SEKOLAH */}
							<div className="field">
								<FloatLabel className="mb-4 mt-6 w-full fadeinleft animation-duration-500">
									<InputText
										id="sekolah"
										name="sekolah"
										value={formData.sekolah}
										onChange={handleChange}
										className="p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label htmlFor="sekolah">Sekolah</label>
								</FloatLabel>
							</div>

							{/* KELAS */}
							<div className="field">
								<FloatLabel className="mb-4 mt-6 w-full fadeinleft animation-duration-500">
									<InputText
										id="kelas"
										name="kelas"
										value={formData.kelas}
										onChange={handleChange}
										className="p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label htmlFor="kelas">Kelas</label>
								</FloatLabel>
							</div>
							{isNew && (
								<div className="field">
									<FloatLabel className=" mb-4 mt-6 w-12 fadeinright animation-duration-500  ">
										<Password
											name="password"
											autoComplete="one-time-code"
											value={formData.password || ""}
											onChange={handleChange}
											promptLabel={
												isNew
													? "Masukan kata sandi"
													: "Leave blank to keep current password"
											}
											weakLabel="Terlalu sederhana"
											mediumLabel="Kata sandi Menengah"
											strongLabel="Kata sandi Kuat"
											footer={footer}
											required
											inputId="password"
											toggleMask
											className="p-inputtext-md w-full"
											pt={{ input: { className: "w-full" } }}
										/>
										<label className="lufga" htmlFor="password">
											Password
										</label>
									</FloatLabel>
								</div>
							)}
							{isNew && (
								<div className="field">
									<FloatLabel className=" mb-4 mt-6 w-12 fadeinright animation-duration-500 ">
										<Password
											feedback={false}
											tabIndex={1}
											autoComplete="one-time-code"
											name="confPassword"
											value={formData.confPassword}
											onChange={handleChange}
											required
											inputId="confpassword"
											toggleMask
											className="p-inputtext-md w-full"
											pt={{ input: { className: "w-full" } }}
										/>
										<label className="lufga" htmlFor="confpassword">
											Konfirmasi
										</label>
									</FloatLabel>
								</div>
							)}

							<div className="field">
								<FloatLabel className="mb-4 mt-6 w-12 fadeinright animation-duration-500">
									<Dropdown
										name="role"
										value={formData.role}
										onChange={handleChange}
										options={roles}
										optionLabel="name"
										optionValue="code"
										className="w-12"
									/>
									<label htmlFor="role">Pilih Role</label>
								</FloatLabel>
							</div>
							<div className="field">
								<FloatLabel className="mb-4 mt-6 w-12 fadeinright animation-duration-500">
									<Dropdown
										name="isVerified"
										value={formData.isVerified}
										onChange={(e) =>
											setFormData({ ...formData, isVerified: e.value })
										}
										options={Status}
										optionLabel="name"
										optionValue="code"
										className="w-12"
									/>
									<label htmlFor="isVerified">Pilih Status</label>
								</FloatLabel>
							</div>
							<div className="  py-3 w-12 flex justify-content-center md:justify-content-end">
								<Button
									disabled={saveData !== null}
									label={
										saveData !== null ? "" : isNew ? "Tambah Data" : "Simpan"
									}
									icon={saveData === null ? "" : "pi pi-spin pi-spinner-dotted"}
									type="submit"
									className=" lufga-semi-bold mt-3 fadeindown animation-duration-500 gradient-button w-12 "
								/>
							</div>
						</form>
					)}
					{isShow && (
						<form onSubmit={handleSubmit}>
							<div className="field">
								<label className="label">Name</label>
								<span className="input is-static">{formData.name}</span>
							</div>
							<div className="field">
								<label className="label">Email</label>
								<span className="input is-static">{formData.email}</span>
							</div>
							<div className="field">
								<label className="label">linkmedsos</label>
								<span className="input is-static">{formData.linkmedsos}</span>
							</div>
							<div className="field">
								<label className="label">Role</label>
								<span className="input is-static">{formData.role}</span>
							</div>

							<div className="field">
								<button
									type="button"
									className={`button ${
										formData.isVerified ? "is-danger" : "is-primary"
									}`}
									onClick={handleToggleVerification}
								>
									{formData.isVerified ? "Unverify" : "Verify"}
								</button>
							</div>
							<Messages ref={msgs} />
						</form>
					)}
				</Dialog>
			</div>
		);
	}
);

export default UserModal;
