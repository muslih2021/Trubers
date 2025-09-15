import { NavLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { Link } from "react-router-dom";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import axios from "axios";
import { showDialog } from "../../features/dialogSlice";
import { useDispatch } from "react-redux";
import { Dropdown } from "primereact/dropdown";
import regis1 from "../../assets/images/regis2.png";
import regis2 from "../../assets/images/regis1.png";
import logo from "../../assets/images/logo.png";
import logot from "../../assets/images/logot.png";

const Regis = () => {
	const toast = useRef(null);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [linkmedsos, setlinkmedsos] = useState("");
	const [password, setPassword] = useState("");
	const [confPassword, setConfPassword] = useState("");
	const [ktp, setKtp] = useState(null);
	const [msg, setMsg] = useState("");
	const [sosmedUtama, setSosmedUtama] = useState();
	const [namaAkun, setNamaAkun] = useState("");
	const [jumlahFollowerTerakhir, setJumlahFollowerTerakhir] = useState("");
	const [interestMinat, setInterestMinat] = useState("");
	const [kota, setKota] = useState("");
	const [sekolah, setSekolah] = useState("");
	const [kelas, setKelas] = useState();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);

	const API_URL = import.meta.env.VITE_API_URL_BACKEND;

	const saveUser = async (e) => {
		e.preventDefault();

		if (loading) return;
		setLoading(true);

		const formData = new FormData();
		formData.append("name", name);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("confPassword", confPassword);
		formData.append("linkmedsos", linkmedsos);
		// Tambahan kolom baru
		formData.append("sosmed_utama", sosmedUtama);
		formData.append("nama_akun", namaAkun);
		formData.append("jumlah_follower_terakhir", jumlahFollowerTerakhir);
		formData.append("interest_minat", interestMinat);
		formData.append("kota", kota);
		formData.append("sekolah", sekolah);
		formData.append("kelas", kelas);
		try {
			const response = await axios.post(`${API_URL}/regis`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			const massage = response.data.msg;
			setMsg(response.data.msg);
			navigate("/login");
			dispatch(showDialog({ severity: "success", message: massage }));
			console.log("pesan", massage);

			// toast.current.show({ severity: 'success', summary: 'Success', detail:msg, life: 3000 });
		} catch (error) {
			if (error.response) {
				setMsg(error.response.data.msg);
				toast.current.show({
					severity: "error",
					summary: "Error",
					detail: error.response.data.msg,
					life: 3000,
				});
				setLoading(false);
			}
		}
	};

	const tutorials = [
		{
			id: 1,
			title: "Pastikan Datamu Benar",
			description:
				"Pastikan semua data yang kamu isi benar dan lengkap, agar proses pendaftaran lancar serta memudahkan kami menghubungi kamu untuk informasi selanjutnya.",
			image: regis1,
			namaTombol: "Sign In",
			link: "/login",
		},
		{
			id: 2,
			title: "Jangan Ketinggalan Info!",
			description:
				"Selalu cek email atau WhatsApp kamu untuk mendapatkan notifikasi resmi seputar informasi, pengumuman, dan kesempatan terbaru dari TRUBERS.",
			image: regis2,
			namaTombol: "Email",
			link: "https://mail.google.com/mail/u/0/",
		},
	];
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
	const tutorialTemplate = (tutorial) => {
		return (
			<div className="text-center fadeinleft animation-duration-1000">
				<div className=" white text-center flex align-items-center justify-content-center flex-column">
					<img style={{ width: "60%", height: "auto" }} src={tutorial.image} />
					<h2 className="md:text-2xl text-lg lufga-extra-bold">
						{tutorial.title}
					</h2>
					<p className=" text-center md:w-12 w-8"> {tutorial.description}</p>
					<div className="my-2 flex flex-wrap  justify-content-center">
						<NavLink to={tutorial.link}>
							<Button
								label={tutorial.namaTombol}
								style={{ color: "white" }}
								severity="secondary"
								className="shadow-5 hover:shadow-1"
								text
							/>
						</NavLink>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="flex fadein md:overflow-hidden animation-duration-2000 background-gradient flex-column md:flex-row md:h-screen   min-w-screen">
			<Toast ref={toast} />
			<form
				onSubmit={saveUser}
				className="bg-white md:overflow-y-auto  md:py-8 flex-order-3 md:flex-order-3 flex-1 flex flex-column  align-items-center justify-content-center"
			>
				<div className="md:w-9 fadeinup   animation-duration-2000  align-items-center md:-ml-8 flex gap-4 md:-mt-8 mb-4  md:mb-4">
					<img src={logo} alt="" className="md:w-8rem signup-title w-8rem  " />
					<img src={logot} alt="" className="md:w-8rem signup-title w-8rem  " />
				</div>

				<h1 className="w-10 text-title text-5xl text-left lufga-extrabold fadeinup animation-duration-1000">
					Form Pendaftaran
				</h1>
				<p
					style={{ color: "var(--surface-400)" }}
					className="lufga text-sm -mt-3 w-10 text-left"
				>
					Yuk Lengkapi Data Anda Untuk Melakukan Pendaftaran Menjadi Trust
					Builder Telkomsel
				</p>
				<div className="md:flex  gap-2 md:mb-3 mt-4 w-10">
					<div className="flex-1 flex flex-column gap-5 justify-content-start">
						<FloatLabel className="flex-1 fadeinright animation-duration-1000">
							<InputText
								keyfilter="email"
								required
								id="email"
								autoComplete="new-email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className=":p-inputtext-sm md:p-inputtext-md w-full"
							/>
							<label className="lufga" htmlFor="email">
								Email
							</label>
						</FloatLabel>
						<FloatLabel className="w-12  md:my-0 fadeinright animation-duration-1000">
							<InputText
								required
								autoComplete="new-name"
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className=":p-inputtext-sm md:p-inputtext-md w-full"
							/>
							<label className="lufga" htmlFor="name">
								Nama
							</label>
						</FloatLabel>
						{/* Sosmed Utama */}

						<FloatLabel className="flex-1  md:my-0 fadeinright animation-duration-1000">
							<Dropdown
								id="sosmed_utama"
								value={sosmedUtama}
								options={[
									{ label: "Instagram", value: "instagram" },
									{ label: "TikTok", value: "tiktok" },
								]}
								onChange={(e) => setSosmedUtama(e.value)}
								placeholder="Pilih Sosmed Utama"
								style={{ width: "100%" }}
								required
							/>
							<label className="lufga" htmlFor="sosmed_utama">
								Sosmed Utama
							</label>
						</FloatLabel>

						{/* Nama Akun */}
						<FloatLabel className="flex-1  md:my-0 fadeinright animation-duration-1000">
							<InputText
								id="nama_akun"
								value={namaAkun}
								onChange={(e) => setNamaAkun(e.target.value)}
								className=":p-inputtext-sm md:p-inputtext-md w-full"
								required
							/>
							<label className="lufga" htmlFor="nama_akun">
								Nama Akun/tanpa tanda '@''
							</label>
						</FloatLabel>
						{/* Link Akun */}
						<FloatLabel className="w-12 md:my-0 fadeinright animation-duration-1000">
							<InputText
								required
								id="linkmedsos"
								autoComplete="new-linkmedsos"
								value={linkmedsos}
								onChange={(e) => setlinkmedsos(e.target.value)}
								className=":p-inputtext-sm md:p-inputtext-md w-full"
							/>
							<label className="lufga" htmlFor="linkmedsos">
								Link Media Sosial
							</label>
						</FloatLabel>

						{/* Jumlah Follower Terakhir */}
						<FloatLabel className="flex-1 md:my-0 fadeinright animation-duration-1000">
							<InputText
								id="jumlah_follower_terakhir"
								type="number"
								value={jumlahFollowerTerakhir}
								onChange={(e) => {
									const value = parseInt(e.target.value, 10);
									if (value >= 0 || e.target.value === "") {
										setJumlahFollowerTerakhir(e.target.value);
									}
								}}
								min={0}
								className=":p-inputtext-sm md:p-inputtext-md w-full"
								required
							/>
							<label className="lufga" htmlFor="jumlah_follower_terakhir">
								Jumlah Follower Terakhir
							</label>
						</FloatLabel>

						{/* Interest / Minat */}
						<FloatLabel className="flex-1  md:my-0 fadeinright animation-duration-1000">
							<InputText
								id="interest_minat"
								value={interestMinat}
								onChange={(e) => setInterestMinat(e.target.value)}
								className=":p-inputtext-sm md:p-inputtext-md w-full"
								required
							/>
							<label className="lufga" htmlFor="interest_minat">
								Interest / Minat
							</label>
						</FloatLabel>

						{/* Kota */}
						<FloatLabel className="flex-1  md:my-0 fadeinright animation-duration-1000">
							<InputText
								id="kota"
								value={kota}
								onChange={(e) => setKota(e.target.value)}
								className=":p-inputtext-sm md:p-inputtext-md w-full"
								required
							/>
							<label className="lufga" htmlFor="kota">
								Kota
							</label>
						</FloatLabel>

						{/* Sekolah */}
						<FloatLabel className="flex-1 md:my-0 fadeinright animation-duration-1000">
							<InputText
								id="sekolah"
								value={sekolah}
								onChange={(e) => setSekolah(e.target.value)}
								className=":p-inputtext-sm md:p-inputtext-md w-full"
								required
							/>
							<label className="lufga" htmlFor="sekolah">
								Sekolah
							</label>
						</FloatLabel>
						{/* Kelas */}
						<FloatLabel className="flex-1 md:my-0 fadeinright animation-duration-1000">
							<Dropdown
								id="kelas"
								value={kelas}
								options={[
									{ label: "10", value: "10" },
									{ label: "11", value: "11" },
								]}
								onChange={(e) => setKelas(e.value)}
								placeholder="Pilih Kelas"
								className="w-full"
							/>
							<label className="lufga" htmlFor="kelas">
								Kelas
							</label>
						</FloatLabel>
						<FloatLabel className=" flex-1   fadeinright animation-duration-1000  ">
							<Password
								name="password"
								autoComplete="one-time-code"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								promptLabel="Masukan kata sandi"
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
						<FloatLabel className="flex-1  fadeinright animation-duration-1000 ">
							<Password
								feedback={false}
								tabIndex={1}
								autoComplete="one-time-code"
								name="new-password"
								value={confPassword}
								onChange={(e) => setConfPassword(e.target.value)}
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
				</div>

				<div className="flex w-10 mt-2 ">
					<p
						style={{ color: "var(--surface-400)" }}
						className="mt-2 flex-1  text-left text-sm"
					>
						Sudah punya akun?{" "}
						<Link to="/login" className="Link lufga">
							Log in
						</Link>
					</p>
					<Link
						to="/forgot-password"
						className="mt-2 flex-1 Link lufga text-right  text-sm"
					>
						Lupa password?
					</Link>
				</div>
				<Button
					label={loading ? "Loading....." : "Daftar"}
					disabled={loading}
					type="submit"
					className=" lufga-semi-bold mt-3 md:mb-3 md:py-4 mb-8 fadeindown animation-duration-1000 gradient-button w-10"
				/>
			</form>

			<div className=" pt-4  align-items-center   flex-order-1 md:flex-order-1 flex-1  text-center flex justify-content-center">
				<div className="card  flex justify-content-center align-items-center ">
					<Carousel
						value={tutorials}
						numScroll={1}
						numVisible={1}
						itemTemplate={tutorialTemplate}
						circular
						autoplayInterval={8000}
						pt={{
							indicators: { className: "custom-dots" },
							previousButton: { className: "custom-prev" },
							nextButton: { className: "custom-next" },
						}}
					/>
				</div>
			</div>
			<div className="w-full  md:w-30rem -mb-4 md:-mb-0  md:h-screen  wave flex-order-2">
				<svg
					className="hidden md:block"
					id="visual"
					viewBox="0 0 540 960"
					width="540"
					height="960"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					version="1.1"
				>
					<path
						d="M485 960L471.5 933.3C458 906.7 431 853.3 426.3 800C421.7 746.7 439.3 693.3 452.2 640C465 586.7 473 533.3 457.8 480C442.7 426.7 404.3 373.3 395.7 320C387 266.7 408 213.3 407.2 160C406.3 106.7 383.7 53.3 372.3 26.7L361 0L540 0L540 26.7C540 53.3 540 106.7 540 160C540 213.3 540 266.7 540 320C540 373.3 540 426.7 540 480C540 533.3 540 586.7 540 640C540 693.3 540 746.7 540 800C540 853.3 540 906.7 540 933.3L540 960Z"
						fill="#FFFFFF"
						stroke-linecap="round"
						stroke-linejoin="miter"
					></path>
				</svg>
				<svg
					id="visual"
					viewBox="0 0 960 80"
					width="960"
					height="80"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					version="1.1"
				>
					<path
						d="M0 16L8.8 24.3C17.7 32.7 35.3 49.3 53.2 54.3C71 59.3 89 52.7 106.8 48.7C124.7 44.7 142.3 43.3 160 44.8C177.7 46.3 195.3 50.7 213.2 52C231 53.3 249 51.7 266.8 48C284.7 44.3 302.3 38.7 320 39.2C337.7 39.7 355.3 46.3 373.2 50.8C391 55.3 409 57.7 426.8 59C444.7 60.3 462.3 60.7 480 59.5C497.7 58.3 515.3 55.7 533.2 56.3C551 57 569 61 586.8 63C604.7 65 622.3 65 640 62.2C657.7 59.3 675.3 53.7 693.2 48.2C711 42.7 729 37.3 746.8 34.2C764.7 31 782.3 30 800 35.2C817.7 40.3 835.3 51.7 853.2 52C871 52.3 889 41.7 906.8 34.8C924.7 28 942.3 25 951.2 23.5L960 22L960 81L951.2 81C942.3 81 924.7 81 906.8 81C889 81 871 81 853.2 81C835.3 81 817.7 81 800 81C782.3 81 764.7 81 746.8 81C729 81 711 81 693.2 81C675.3 81 657.7 81 640 81C622.3 81 604.7 81 586.8 81C569 81 551 81 533.2 81C515.3 81 497.7 81 480 81C462.3 81 444.7 81 426.8 81C409 81 391 81 373.2 81C355.3 81 337.7 81 320 81C302.3 81 284.7 81 266.8 81C249 81 231 81 213.2 81C195.3 81 177.7 81 160 81C142.3 81 124.7 81 106.8 81C89 81 71 81 53.2 81C35.3 81 17.7 81 8.8 81L0 81Z"
						fill="#FFFFFF"
						strokeLinecap="round"
						strokeLinejoin="miter"
					></path>
				</svg>
			</div>
		</div>
	);
};

export default Regis;
