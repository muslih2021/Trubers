import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import {
	updateMe,
	getMe,
	resetUpdateStatus,
	LogOut,
	reset,
} from "../features/authSlice";
import { InputSwitch } from "primereact/inputswitch";
import axios from "axios";
import { Accordion, AccordionTab } from "primereact/accordion";

const API_URL = import.meta.env.VITE_API_URL_BACKEND;

const PUBLIC_KEY =
	"BNkkTERuAj-3d5nEPQWcXlwXxNkGLrqBuAbEDKik_wZje2ASyZXiXM2Oz4Doc_vHnNZ_4V1v-dng4NNGnrTuKME";

function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = atob(base64);
	return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

const ProfileComponent = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isErrorUpdate, isSuccessUpdate, isLoadingUpdate } = useSelector(
		(state) => state.update
	);
	const { user } = useSelector((state) => state.auth);
	const toast = useRef(null);
	const op = useRef(null);
	const lastEventRef = useRef(null);
	const [overlayContent, setOverlayContent] = useState("unsubscribe");
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		linkmedsos: "",
		currentPassword: "",
		newPassword: "",
		confNewPassword: "",
		sosmed_utama: "",
		nama_akun: "",
		jumlah_follower_terakhir: "",
		interest_minat: "",
		kota: "",
		sekolah: "",
		kelas: "",
	});

	const [subscribed, setSubscribed] = useState(false);

	useEffect(() => {
		const checkSubscriptionStatus = async () => {
			try {
				const registration = await navigator.serviceWorker.ready;
				const existingSubscription =
					await registration.pushManager.getSubscription();
				setSubscribed(!!existingSubscription);
			} catch (error) {
				console.error("Cek subscription gagal:", error);
			}
		};

		if (user?.id) checkSubscriptionStatus();
	}, [user]);
	const subscribeManually = async () => {
		try {
			const registration = await navigator.serviceWorker.ready;
			const permission = await Notification.requestPermission();
			if (permission !== "granted") {
				setOverlayContent("denied");
				if (lastEventRef.current) {
					op.current.toggle(lastEventRef.current);
				} else {
					console.warn("Tidak ada event untuk tampilkan OverlayPanel");
				}
				return;
			}
			const existingSubscription =
				await registration.pushManager.getSubscription();
			if (existingSubscription) {
				setSubscribed(true);
				toast.current?.show({
					severity: "info",
					summary: "Info",
					detail: "Sudah berlangganan",
				});
				return;
			}

			const newSub = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
			});

			await fetch(`${API_URL}/subscribe`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					endpoint: newSub.endpoint,
					expirationTime: newSub.expirationTime,
					keys: newSub.toJSON().keys,
					userId: user.id,
				}),
			});

			setSubscribed(true);
			toast.current?.show({
				severity: "success",
				summary: "Berhasil",
				detail: "Notifikasi aktif",
			});
		} catch (error) {
			console.error(error);
			toast.current?.show({
				severity: "error",
				summary: "Gagal",
				detail: "Gagal mengaktifkan notifikasi",
			});
		}
	};

	const [tandaTangan, setTandaTangan] = useState(null);
	const [previewTtd, setPreviewTtd] = useState("");
	const [ktp, setKtp] = useState(null);
	const [previewKtp, setPreviewKtp] = useState("");
	const [profile, setProfile] = useState(null);
	const [previewProfile, setPreviewProfile] = useState("");
	const [emailNotifikasi, setEmailNotifikasi] = useState(false);

	useEffect(() => {
		if (user) {
			setEmailNotifikasi(user.email_notifikasi);
		}
	}, [user]);

	const toggleEmailNotifikasi = async () => {
		try {
			setLoading(true);
			const res = await axios.patch(`${API_URL}/user/notifikasi/${user.uuid}`);

			setEmailNotifikasi(res.data.email_notifikasi); // ⬅️ update langsung state
			dispatch(getMe()); // untuk sync ulang redux

			toast.current.show({
				severity: "success",
				summary: "Berhasil",
				detail: res.data.msg,
				life: 3000,
			});
		} catch (error) {
			toast.current.show({
				severity: "error",
				summary: "Gagal",
				detail: error.response?.data?.msg || "Gagal memperbarui notifikasi",
				life: 3000,
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || "",
				email: user.email || "",
				linkmedsos: user.linkmedsos || "",
				sosmed_utama: user.sosmed_utama || "",
				nama_akun: user.nama_akun || "",
				jumlah_follower_terakhir: user.jumlah_follower_terakhir || "",
				interest_minat: user.interest_minat || "",
				kota: user.kota || "",
				sekolah: user.sekolah || "",
				kelas: user.kelas || "",
			});
			setPreviewKtp(user.url_foto_ktp || "");
			setPreviewTtd(user.url_tanda_tangan || "");
			setPreviewProfile(user.url_foto_profile || "");
		}
	}, [user]);

	useEffect(() => {
		if (isSuccessUpdate) {
			dispatch(getMe());
		}
	}, [isSuccessUpdate, dispatch]);

	useEffect(() => {
		if (isSuccessUpdate || isErrorUpdate) {
			const timer = setTimeout(() => dispatch(resetUpdateStatus()), 3000);
			return () => clearTimeout(timer);
		}
	}, [isSuccessUpdate, isErrorUpdate, dispatch]);

	const loadImage = (e, setFile, setPreview) => {
		const file = e.target.files[0];
		if (file) {
			setFile(file);
			setPreview(URL.createObjectURL(file));
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formDataToSend = new FormData();
		formDataToSend.append("name", formData.name);
		formDataToSend.append("email", formData.email);
		formDataToSend.append("linkmedsos", formData.linkmedsos);
		formDataToSend.append("sosmed_utama", formData.sosmed_utama);
		formDataToSend.append("nama_akun", formData.nama_akun);
		formDataToSend.append(
			"jumlah_follower_terakhir",
			formData.jumlah_follower_terakhir
		);
		formDataToSend.append("interest_minat", formData.interest_minat);
		formDataToSend.append("kota", formData.kota);
		formDataToSend.append("sekolah", formData.sekolah);
		formDataToSend.append("kelas", formData.kelas);
		if (ktp) formDataToSend.append("foto_ktp", ktp);
		if (profile) formDataToSend.append("foto_profile", profile);

		if (
			typeof tandaTangan === "string" &&
			tandaTangan.startsWith("data:image")
		) {
			const blob = dataURLtoBlob(tandaTangan);
			formDataToSend.append("tanda_tangan", blob, "signature.png");
		} else if (tandaTangan) {
			formDataToSend.append("tanda_tangan", tandaTangan);
		}

		try {
			await dispatch(updateMe(formDataToSend)).unwrap();
			toast.current.show({
				severity: "success",
				summary: "Berhasil",
				detail: "Data berhasil diperbarui",
				life: 3000,
			});
		} catch (err) {
			toast.current.show({
				severity: "error",
				summary: "Gagal",
				detail: err.message || "Terjadi kesalahan saat memperbarui data",
				life: 3000,
			});
		}
	};

	const dataURLtoBlob = (dataURL) => {
		const arr = dataURL.split(",");
		const mime = arr[0].match(/:(.*?);/)[1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], { type: mime });
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
	const formatlinkmedsos = (linkmedsos) => {
		if (!linkmedsos) return "";
		return linkmedsos.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4");
	};
	const logout = () => {
		dispatch(LogOut());
		dispatch(reset());
		navigate("/");
	};
	const handleChangePassword = async (e) => {
		e.preventDefault();

		if (formData.newPassword !== formData.confNewPassword) {
			toast.current.show({
				severity: "error",
				summary: "Gagal",
				detail: "Konfirmasi password baru tidak cocok!",
				life: 3000,
			});
			return;
		}

		try {
			setLoading(true);
			await axios.patch(`${API_URL}/update-password`, {
				currentPassword: formData.currentPassword,
				newPassword: formData.newPassword,
			});

			toast.current.show({
				severity: "success",
				summary: "Berhasil",
				detail: "Password berhasil diubah",
				life: 3000,
			});

			setFormData((prev) => ({
				...prev,
				currentPassword: "",
				newPassword: "",
				confNewPassword: "",
			}));
		} catch (error) {
			toast.current.show({
				severity: "error",
				summary: "Gagal",
				detail: error.response?.data?.msg || "Gagal mengubah password",
				life: 3000,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="profile min-w-full md:flex pb-4 md:flex-column px-3 md:px-6  justify-content-start gap-6">
			<Toast ref={toast} />
			<h1 className="lufga-extrabold md:text-5xl text-title text-3xl">
				Pengaturan Profile{" "}
			</h1>
			<form onSubmit={handleSubmit} className=" ">
				<div className="border-round-xl gradient-border md:-mt-3 py-3 px-3 md:px-6  md:py-2 md:pl-4 shadow-4  w-full">
					<h2 className="text-title lufga">Detail Profil</h2>
					<div className="md:my-6 flex-column md:flex-row flex md:gap-8 align-items-center">
						{previewProfile ? (
							<div
								style={{
									width: "10rem",
									height: "10rem",
									borderRadius: "50%",
									overflow: "hidden",
								}}
							>
								<img
									src={previewProfile}
									alt="Preview Foto Profile"
									style={{ width: "100%", height: "100%", objectFit: "cover" }}
								/>
							</div>
						) : (
							<Avatar
								shape="circle"
								style={{ width: "10rem", height: "10rem" }}
							>
								<i
									className="pi pi-user"
									style={{ color: "#708090", fontSize: "2.5rem" }}
								></i>
							</Avatar>
						)}

						<div className="control flex flex-column align-items-center md:align-items-start my-4 md:my-0 md:justify-content-center">
							<div className="file w-10rem">
								<label className="file-label">
									<input
										type="file"
										className="file-input "
										onChange={(e) =>
											loadImage(e, setProfile, setPreviewProfile)
										}
									/>
									<span className="file-cta">
										<span>Pilih Foto Profil</span>
									</span>
								</label>
							</div>
							<p
								style={{ color: "var(--surface-400)" }}
								className="lufga text-xs text-justify md:text-sm   md:text-left"
							>
								*Ukuran gambar harus memiliki rasio 1:1, maksimal 500kb, dan
								berekstensi .png atau .jpg/.jpeg
							</p>
						</div>
					</div>
					<h3
						style={{ color: "var(--surface-500)" }}
						className="mb-0 md:-mt-1 my-4 "
					>
						Data Diri
					</h3>
					<div className="md:flex align-items-center gap-4 ">
						<div className="flex-1 flex gap-6 flex-column ">
							<FloatLabel className="fles-1 mt-4 fadeinright animation-duration-1000">
								<InputText
									name="name"
									required
									autoComplete="new-name"
									id="name"
									value={formData.name || ""}
									onChange={handleChange}
									className=":p-inputtext-sm md:p-inputtext-md w-full"
								/>
								<label className="lufga" htmlFor="name">
									Nama
								</label>
							</FloatLabel>
							<FloatLabel className="w-12  fadeinright animation-duration-1000">
								<InputText
									name="linkmedsos"
									value={formData.linkmedsos || ""}
									onChange={handleChange}
									required
									id="linkmedsos"
									autoComplete="new-linkmedsos"
									className=":p-inputtext-sm md:p-inputtext-md w-full"
								/>
								<label className="lufga" htmlFor="linkmedsos">
									Link Media Sosial
								</label>
							</FloatLabel>
							<FloatLabel className="flex-1 fadeinright animation-duration-1000">
								<InputText
									keyfilter="email"
									name="email"
									required
									id="email"
									autoComplete="new-email"
									value={formData.email || ""}
									onChange={handleChange}
									className=":p-inputtext-sm md:p-inputtext-md w-full"
								/>
								<label className="lufga" htmlFor="email">
									Email
								</label>
							</FloatLabel>
							<FloatLabel className="flex-1 fadeinright animation-duration-1000">
								<InputText
									name="sosmed_utama"
									required
									id="sosmed_utama"
									value={formData.sosmed_utama || ""}
									onChange={handleChange}
									className="p-inputtext-sm md:p-inputtext-md w-full"
								/>
								<label className="lufga" htmlFor="sosmed_utama">
									Sosial Media Utama
								</label>
							</FloatLabel>

							<FloatLabel className="flex-1 fadeinright animation-duration-1000">
								<InputText
									name="nama_akun"
									required
									id="nama_akun"
									value={formData.nama_akun || ""}
									onChange={handleChange}
									className="p-inputtext-sm md:p-inputtext-md w-full"
								/>
								<label className="lufga" htmlFor="nama_akun">
									Nama Akun
								</label>
							</FloatLabel>

							<FloatLabel className="flex-1 fadeinright animation-duration-1000">
								<InputText
									name="jumlah_follower_terakhir"
									id="jumlah_follower_terakhir"
									keyfilter="int"
									value={formData.jumlah_follower_terakhir || ""}
									onChange={handleChange}
									className="p-inputtext-sm md:p-inputtext-md w-full"
								/>
								<label className="lufga" htmlFor="jumlah_follower_terakhir">
									Jumlah Follower Terakhir
								</label>
							</FloatLabel>

							<FloatLabel className="flex-1 fadeinright animation-duration-1000">
								<InputText
									name="interest_minat"
									id="interest_minat"
									value={formData.interest_minat || ""}
									onChange={handleChange}
									className="p-inputtext-sm md:p-inputtext-md w-full"
								/>
								<label className="lufga" htmlFor="interest_minat">
									Interest / Minat
								</label>
							</FloatLabel>

							<FloatLabel className="flex-1 fadeinright animation-duration-1000">
								<InputText
									name="kota"
									id="kota"
									value={formData.kota || ""}
									onChange={handleChange}
									className="p-inputtext-sm md:p-inputtext-md w-full"
								/>
								<label className="lufga" htmlFor="kota">
									Kota
								</label>
							</FloatLabel>

							<FloatLabel className="flex-1 fadeinright animation-duration-1000">
								<InputText
									name="sekolah"
									id="sekolah"
									value={formData.sekolah || ""}
									onChange={handleChange}
									className="p-inputtext-sm md:p-inputtext-md w-full"
								/>
								<label className="lufga" htmlFor="sekolah">
									Sekolah
								</label>
							</FloatLabel>

							<FloatLabel className="flex-1 fadeinright animation-duration-1000">
								<InputText
									name="kelas"
									id="kelas"
									value={formData.kelas || ""}
									onChange={handleChange}
									className="p-inputtext-sm md:p-inputtext-md w-full"
								/>
								<label className="lufga" htmlFor="kelas">
									Kelas
								</label>
							</FloatLabel>
						</div>
					</div>

					<div className="md:mt-8 md:py-5  py-3 flex justify-content-center md:justify-content-end">
						<Button
							disabled={isLoadingUpdate}
							label={isLoadingUpdate ? "Menyimpan..." : "Simpan Perubahan"}
							type="submit"
							className=" lufga-semi-bold mt-3 fadeindown animation-duration-1000 gradient-button w-12 md:w-2"
						/>
					</div>
				</div>
			</form>
			{/*password*/}
			<form onSubmit={handleChangePassword}>
				<div className="border-round-xl Grayscale-border mt-8 mb-0 py-3 px-3 md:px-6  md:py-2 md:pl-4 shadow-4  w-full">
					<h2 className="text-title lufga">Ganti Password</h2>
					<div className="md:my-4 flex-column flex md:gap-2">
						<FloatLabel className="my-3 w-12 fadeinright animation-duration-1000 ">
							<Password
								feedback={false}
								tabIndex={1}
								autoComplete="one-time-code"
								name="currentPassword"
								value={formData.currentPassword || ""}
								onChange={handleChange}
								inputId="currentPassword"
								toggleMask
								className="p-inputtext-md w-full"
								pt={{ input: { className: "w-full" } }}
							/>
							<label className="lufga" htmlFor="currentPassword">
								Password Lama
							</label>
						</FloatLabel>
						<div className="md:flex md:gap-5">
							<FloatLabel className="my-3 w-12 fadeinright animation-duration-1000  ">
								<Password
									name="newPassword"
									autoComplete="one-time-code"
									value={formData.newPassword || ""}
									onChange={handleChange}
									promptLabel="Masukan kata sandi"
									weakLabel="Terlalu sederhana"
									mediumLabel="Kata sandi Menengah"
									strongLabel="Kata sandi Kuat"
									footer={footer}
									inputId="newPassword"
									toggleMask
									className="p-inputtext-md w-full"
									pt={{ input: { className: "w-full" } }}
								/>
								<label className="lufga" htmlFor="newPassword">
									Password Baru
								</label>
							</FloatLabel>

							<FloatLabel className="my-3 w-12 fadeinright animation-duration-1000 ">
								<Password
									feedback={false}
									tabIndex={1}
									autoComplete="one-time-code"
									name="confNewPassword"
									value={formData.confNewPassword || ""}
									onChange={handleChange}
									inputId="confNewPassword"
									toggleMask
									className="p-inputtext-md w-full"
									pt={{ input: { className: "w-full" } }}
								/>
								<label className="lufga" htmlFor="confNewPassword">
									Konfirmasi Password Baru
								</label>
							</FloatLabel>
						</div>

						<div className=" md:py-0   py-3 flex justify-content-center md:justify-content-end">
							<Button
								disabled={isLoadingUpdate}
								label={isLoadingUpdate ? "Mengubah..." : "Ubah Password"}
								type="submit"
								className=" lufga-semi-bold mt-3 fadeindown animation-duration-1000 gradient-button w-12 md:w-2"
							/>
						</div>
					</div>
				</div>
			</form>
			<Accordion className="md:my-0 my-4">
				<AccordionTab
					header={
						<span className="flex align-items-center gap-2 w-full">
							<i className="pi pi-bell mx-2" style={{ fontSize: "1rem" }}></i>
							<span className="font-bold white-space-nowrap">Notifikasi</span>
						</span>
					}
				>
					<div className="flex flex-column gap-2">
						<div className="flex align-items-center  justify-content-between ">
							<label className="label text-md">Notifikasi Lewat Email</label>
							<div className="control ">
								<InputSwitch
									key={String(emailNotifikasi)} // force rerender saat emailNotifikasi berubah
									checked={emailNotifikasi}
									onChange={() => toggleEmailNotifikasi()}
									disabled={loading}
								/>
							</div>
						</div>
					</div>
				</AccordionTab>
			</Accordion>
			<Button
				label="Keluar"
				severity="danger"
				className="w-12  mb-8"
				onClick={logout}
				outlined
			/>
		</div>
	);
};

export default ProfileComponent;
