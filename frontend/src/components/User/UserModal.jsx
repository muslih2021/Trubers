import React, {
	useState,
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import { Dialog } from "primereact/dialog";
import { Messages } from "primereact/messages";

import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { InputMask } from "primereact/inputmask";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const UserModal = forwardRef(
	(
		{ isOpen, closeModal, user, saveUser, msg, isNew, isShow, saveData },
		ref
	) => {
		const [tandaTangan, setTandaTangan] = useState(null);
		const [ktp, setKtp] = useState(null);
		const [previewTtd, setPreviewTtd] = useState("");
		const [previewKtp, setPreviewKtp] = useState("");
		const [formData, setFormData] = useState({
			name: "",
			email: "",
			linkmedsos: "",
			password: "",
			confPassword: "",
			role: "user",
			isVerified: false,
		});

		const msgs = useRef(null);

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

		const loadImageTtd = (e) => {
			const file = e.target.files[0];
			setTandaTangan(file);
			setPreviewTtd(URL.createObjectURL(file));
		};

		const loadImageKtp = (e) => {
			const file = e.target.files[0];
			setKtp(file);
			setPreviewKtp(URL.createObjectURL(file));
		};

		useEffect(() => {
			console.log("User in modals:", user);
			if (user) {
				setFormData(user);
				if (user.url_foto_ktp) {
					setPreviewKtp(user.url_foto_ktp);
				} else {
					setPreviewKtp("");
				}

				if (user.url_tanda_tangan) {
					setPreviewTtd(user.url_tanda_tangan);
				} else {
					setPreviewTtd("");
				}
			}
		}, [user]);

		const handleChange = (e) => {
			setFormData({ ...formData, [e.target.name]: e.target.value });
		};

		useEffect(() => {
			if (!isOpen) {
				setFormData({
					name: "",
					email: "",
					linkmedsos: "",
					password: "",
					confPassword: "",
					role: "user",
					isVerified: false,
				});
				setKtp("");
				setPreviewKtp("");
				setTandaTangan("");
				setPreviewTtd("");
			}
		}, [isOpen]);

		const handleSubmit = (e) => {
			e.preventDefault();
			console.log("FormData sebelum submit:", formData);
			const uploadData = new FormData();
			Object.keys(formData).forEach((key) => {
				uploadData.append(key, formData[key]);
			});
			uploadData.append("foto_ktp", ktp);
			uploadData.append("tanda_tangan", tandaTangan);

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

							{/* <div className="md:flex align-items-center gap-4 mb-4 mt-6">
								<div className="flex-1 fadeinleft animation-duration-500 md:mt-0 mt-6 border-round-xl shadow-4 max-h-20rem  flex  flex-column justify-content-between align-items-center">
									{previewKtp && (
										<div className="image w-12 p-2 overflow-hidden">
											<Image
												src={previewKtp}
												alt="Image"
												preview
												pt={{
													image: {
														style: {
															width: "100%",
															height: "auto",
															objectFit: "cover",
														},
													},
												}}
											/>
										</div>
									)}
									<div className="control w-full ">
										<div className="file">
											<label className="file-label">
												<input
													type="file"
													className="file-input"
													onChange={loadImageKtp}
												/>
												<span className="file-cta">
													<span>Pilih Foto Ktp</span>
												</span>
											</label>
										</div>
									</div>
								</div>
								<div className="flex-1 fadeinright animation-duration-500 md:mt-0 mt-6 border-round-xl shadow-4 max-h-20rem  flex  flex-column justify-content-between align-items-center">
									{previewKtp && (
										<div className="image w-12 p-2 overflow-hidden">
											<Image
												src={previewTtd}
												alt="Image"
												preview
												pt={{
													image: {
														style: {
															width: "100%",
															height: "auto",
															objectFit: "cover",
														},
													},
												}}
											/>
										</div>
									)}
									<div className="control w-full ">
										<div className="file">
											<label className="file-label">
												<input
													type="file"
													className="file-input"
													onChange={loadImageTtd}
												/>
												<span className="file-cta">
													<span>Pilih Foto Tanda Tangan</span>
												</span>
											</label>
										</div>
									</div>
								</div>
							</div> */}
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
								<label className="label">Foto Ktp</label>
								<img class=" image is-128x128" src={formData.url_foto_ktp} />
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
