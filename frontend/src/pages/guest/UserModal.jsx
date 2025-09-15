import React, {
	useState,
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Avatar } from "primereact/avatar";
import { Image } from "primereact/image";
const UserModal = forwardRef(({ isOpen, closeModal, user }, ref) => {
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

	if (!isOpen) return null;

	return (
		<div>
			<Dialog
				breakpoints={{ "960px": "75vw", "641px": "100vw" }}
				visible={isOpen}
				style={{
					position: "absolute",
					width: "100vw",
					maxHeight: "100vh",
					zIndex: "50000000",
				}}
				contentStyle={{
					padding: "0",
				}}
				onHide={closeModal}
				showHeader={false}
				className=" p-0 m-0"
			>
				<div className="w-12 flex  justify-content-end p-4 custom-dialog">
					{/* tombol manual untuk hide */}
					<i
						className="pi cursor-pointer pi-times"
						onClick={closeModal}
						style={{ fontSize: "1.5rem" }}
					></i>
				</div>
				<form className="relative">
					<div className="">
						<div className=" flex w-12 justify-content-center flex-column flex  align-items-center">
							<div
								style={{
									marginTop: "-1rem",
									width: "10rem",
									height: "10rem",
									borderRadius: "50%",
									background: "#fff",
								}}
								className="z-5 zoomin animation-duration-1000 absolute shadow-2  -mt-3 overflow-hidden border-circle "
							>
								{" "}
								{user?.url_foto_profile ? (
									<Image
										src={user?.url_foto_profile}
										alt="Preview Foto Profile"
										width="100%"
										height="100%"
										preview
									/>
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
							</div>
						</div>
						<div className="w-12 mt-8 flex gap-2 align-items-center  flex-column justify-content-center ">
							<p className="font-jakarta  font-semibold  m-0 p-0  text-2xl">
								{user?.name || ""}
							</p>
							<a
								href={user?.linkmedsos || ""}
								className="font-jakarta hero-desc m-0 p-0 text-md no-underline"
							>
								@{user?.nama_akun || ""}
							</a>
						</div>

						<div className="md:flex py-8 align-items-center gap-4 ">
							<div className="flex-1 flex gap-6  px-6 flex-column ">
								<FloatLabel className="fles-1 mt-4 fadeinright animation-duration-1000">
									<InputText
										name="name"
										required
										autoComplete="new-name"
										id="name"
										disabled
										value={user?.name || ""}
										className=":p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="name">
										Nama
									</label>
								</FloatLabel>
								<FloatLabel className="w-12  fadeinright animation-duration-1000">
									<InputText
										name="linkmedsos"
										value={user?.linkmedsos || ""}
										required
										id="linkmedsos"
										disabled
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
										disabled
										id="email"
										value={user?.email || ""}
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
										disabled
										id="sosmed_utama"
										value={user?.sosmed_utama || ""}
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
										disabled
										id="nama_akun"
										value={user?.nama_akun || ""}
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
										disabled
										keyfilter="int"
										value={user?.jumlah_follower_terakhir || ""}
										className="p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="jumlah_follower_terakhir">
										Jumlah Follower Terakhir
									</label>
								</FloatLabel>

								<FloatLabel className="flex-1 fadeinright animation-duration-1000">
									<InputText
										name="interest_minat"
										disabled
										id="interest_minat"
										value={user?.interest_minat || ""}
										className="p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="interest_minat">
										Interest / Minat
									</label>
								</FloatLabel>

								<FloatLabel className="flex-1 fadeinright animation-duration-1000">
									<InputText
										name="kota"
										disabled
										id="kota"
										value={user?.kota || ""}
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
										disabled
										value={user?.sekolah || ""}
										className="p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="sekolah">
										Sekolah
									</label>
								</FloatLabel>

								<FloatLabel className="flex-1 fadeinright animation-duration-1000">
									<InputText
										name="kelas"
										disabled
										id="kelas"
										value={user?.kelas || ""}
										className="p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="kelas">
										Kelas
									</label>
								</FloatLabel>
							</div>
						</div>
					</div>
				</form>
				{/* <form>
					<div className="field">
						<FloatLabel className="mb-4 mt-6 w-12 fadeinleft animation-duration-500">
							<InputText
								name="name"
								required
								id="name"
								disabled
								value={user?.name || ""}
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
								disabled
								id="email"
								value={user?.email || ""}
								className=":p-inputtext-sm md:p-inputtext-md w-full"
							/>
							<label className="lufga" htmlFor="email">
								Email
							</label>
						</FloatLabel>
					</div>
				</form> */}
			</Dialog>
		</div>
	);
});

export default UserModal;
