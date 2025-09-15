import React, {
	useState,
	useEffect,
	useRef,
	forwardRef,
	useMemo,
	useImperativeHandle,
} from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Avatar } from "primereact/avatar";
import { Image } from "primereact/image";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { Dropdown } from "primereact/dropdown";

import { Skeleton } from "primereact/skeleton";

const DetailModalUser = forwardRef(
	({ isOpen, closeModal, user, theme, setTheme, themedata }, ref) => {
		const msgs = useRef(null);
		const [chartData, setChartData] = useState({});
		const [chartOptions, setChartOptions] = useState({});
		const [chartData2, setChartData2] = useState({});
		const [chartOptions2, setChartOptions2] = useState({});
		const [showChartZoom, setShowChartZoom] = useState(false);
		const [showChartZoom2, setShowChartZoom2] = useState(false);
		const [showDetailUser, setDetailUser] = useState(false);
		// const reports = user?.contentreports || [];
		const reports = useMemo(
			() => user?.contentreports || [],
			[user?.contentreports]
		);
		useEffect(() => {
			if (themedata) {
				console.log("All themes:", themedata);
			}
		}, [themedata]);
		useEffect(() => {
			if (theme) {
				console.log("themes:", theme);
			}
		}, [theme]);

		useEffect(() => {
			if (!user) return;

			const documentStyle = getComputedStyle(document.documentElement);

			// label multi-baris: ["Postingan 1", "12 Agu 2025, 03:23"]
			const labels = reports.map((r, i) => [
				`Postingan ${i + 1}`,
				new Date(r.createdAt).toLocaleString("id-ID", {
					day: "2-digit",
					month: "short",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				}),
			]);

			// helper konversi 0 → 1 (khusus log scale)
			const safeValue = (val) => (val === 0 ? 1 : val);

			const newChartData = {
				labels,
				datasets: [
					{
						label: "Likes",
						data: reports.map((r) => safeValue(r.likes)),
						realData: reports.map((r) => r.likes),
						fill: false,
						tension: 0.4,
						borderColor: "#ff4580a4",
					},
					{
						label: "Comments",
						data: reports.map((r) => safeValue(r.comments)),
						realData: reports.map((r) => r.comments),
						fill: false,
						tension: 0.4,
						borderDash: [5, 5],
						borderColor: documentStyle.getPropertyValue("--blue-500"),
					},
					{
						label: "Views",
						data: reports.map((r) => safeValue(r.video_views)),
						realData: reports.map((r) => r.video_views),
						fill: true,
						tension: 0.4,
						borderColor: documentStyle.getPropertyValue("--teal-500"),
						backgroundColor: (ctx) => {
							const chart = ctx.chart;
							const { ctx: canvasCtx, chartArea } = chart;

							if (!chartArea) return null; // belum render

							const gradient = canvasCtx.createLinearGradient(
								0,
								chartArea.bottom, // mulai dari bawah
								0,
								chartArea.top // ke atas
							);
							gradient.addColorStop(0, "rgba(79, 211, 223, 0)"); // transparan di bawah
							gradient.addColorStop(1, "rgba(79, 211, 223, 0.6)"); // biru tebal di atas

							return gradient;
						},
					},
					{
						label: "Score",
						data: reports.map((r) => safeValue(r.score)),
						realData: reports.map((r) => r.score),
						fill: false,
						tension: 0.4,
						borderColor: "#ffa200",
					},
				],
			};

			const newChartOptions = {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						labels: {
							color: documentStyle.getPropertyValue("--text-color"),
						},
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const dataset = context.dataset;
								const index = context.dataIndex;
								const realValue = dataset.realData[index];
								return `${dataset.label}: ${realValue.toLocaleString("id-ID")}`;
							},
						},
					},
				},
				scales: {
					x: {
						ticks: {
							color: documentStyle.getPropertyValue("--text-color-secondary"),
						},
						grid: {
							color: documentStyle.getPropertyValue("--surface-border"),
						},
					},
					y: {
						type: "logarithmic",
						ticks: {
							callback: (value) => {
								if ([1, 10, 100, 1000, 10000, 50000, 100000].includes(value)) {
									return value === 1 ? "0" : value.toLocaleString("id-ID");
								}
								return "";
							},
							color: documentStyle.getPropertyValue("--text-color-secondary"),
						},
						grid: {
							color: documentStyle.getPropertyValue("--surface-border"),
						},
					},
				},
				onHover: (event, elements, chart) => {
					if (elements?.length > 0) {
						event.native.target.style.cursor = "pointer";
					} else {
						event.native.target.style.cursor = "default";
					}
				},
				// === INI BAGIAN CLICK ===
				onClick: (event, elements) => {
					if (!elements?.length) return;
					const element = elements[0];
					const index = element.index; // index data yang diklik
					const url = reports[index]?.url_postingan;
					if (url) {
						window.open(url, "_blank"); // buka link di tab baru
					}
				},
			};

			setChartData(newChartData);
			setChartOptions(newChartOptions);
		}, [user]);

		// end chart
		useEffect(() => {
			if (!user) return;

			const totalViews = reports.reduce((acc, r) => acc + r.video_views, 0);
			const totalLikes = reports.reduce((acc, r) => acc + r.likes, 0);
			const totalComments = reports.reduce((acc, r) => acc + r.comments, 0);

			const documentStyle = getComputedStyle(document.documentElement);

			const data = {
				labels: ["Views", "Likes", "Comments"],
				datasets: [
					{
						label: "Jumlah",
						data: [totalViews, totalLikes, totalComments],
						backgroundColor: function (context) {
							const chart = context.chart;
							const { ctx: canvasCtx, chartArea } = chart;

							if (!chartArea) return null;

							// Gradient berdasarkan index dataset
							const index = context.dataIndex;

							let gradient;
							if (index === 0) {
								// Views
								gradient = canvasCtx.createLinearGradient(
									0,
									chartArea.bottom,
									0,
									chartArea.top
								);
								gradient.addColorStop(0, "rgba(79, 211, 223, 0)");
								gradient.addColorStop(1, "rgba(79, 211, 223, 0.7)");
							} else if (index === 1) {
								// Likes
								gradient = canvasCtx.createLinearGradient(
									0,
									chartArea.bottom,
									0,
									chartArea.top
								);
								gradient.addColorStop(0, "rgba(0, 200, 83, 0)");
								gradient.addColorStop(1, "rgba(0, 200, 83, 0.7)");
							} else {
								// Comments
								gradient = canvasCtx.createLinearGradient(
									0,
									chartArea.bottom,
									0,
									chartArea.top
								);
								gradient.addColorStop(0, "rgba(255, 0, 79, 0)");
								gradient.addColorStop(1, "rgba(255, 0, 79, 0.7)");
							}
							return gradient;
						},
					},
				],
			};
			const options = {
				indexAxis: "y",
				responsive: true,
				plugins: {
					legend: { display: false },
					tooltip: {
						enabled: true,
						callbacks: {
							label: function (context) {
								const value = context.raw;
								return `${context.label}: ${value.toLocaleString()}`;
							},
						},
					},
					// plugin custom untuk angka di atas bar
					afterDatasetsDraw: (chart) => {
						const ctx = chart.ctx;
						chart.data.datasets.forEach((dataset, i) => {
							const meta = chart.getDatasetMeta(i);
							meta.data.forEach((bar, index) => {
								const value = dataset.data[index];
								ctx.save();
								ctx.fillStyle = "#000";
								ctx.font = "bold 12px Arial";
								ctx.textAlign = "center";
								ctx.textBaseline = "bottom";
								ctx.fillText(value.toLocaleString(), bar.x, bar.y - 4);
								ctx.restore();
							});
						});
					},
				},
				scales: {
					x: {
						type: "logarithmic",
						ticks: {
							values: [1, 1000, 10000, 50000, 100000, 500000, 1000000, 2000000],
							callback: (value) => {
								const labels = {
									1: "1",
									1000: "1k",
									10000: "10k",
									50000: "50k",
									100000: "100k",
									500000: "500k",
									1000000: "1M",
									2000000: "2M",
								};
								return labels[value] || "";
							},
							color: documentStyle.getPropertyValue("--text-color-secondary"),
						},
						grid: {
							color: documentStyle.getPropertyValue("--surface-border"),
						},
					},

					y: {
						beginAtZero: true,
						ticks: {
							color: documentStyle.getPropertyValue("--text-color-secondary"),
						},
					},
				},
			};

			setChartData2(data);
			setChartOptions2(options);
		}, [reports]);

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
									className="z-5 cursor-pointer zoomin animation-duration-1000 absolute shadow-2  -mt-3 overflow-hidden border-circle "
								>
									{" "}
									{user?.url_foto_profile ? (
										<Image
											src={user?.url_foto_profile}
											alt="Preview Foto Profile"
											width="100%"
											height="100%"
											// preview
											onClick={() => setDetailUser(true)}
										/>
									) : (
										<Avatar
											shape="circle"
											style={{ width: "10rem", height: "10rem" }}
											onClick={() => setDetailUser(true)}
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
							<div className="px-4 my-4">
								<Dropdown
									value={theme}
									options={[
										{ id: "semua", name: "Semua Tema" },
										...(themedata || []),
									]}
									onChange={(e) => setTheme(e.value)}
									optionLabel="name"
									optionValue="id"
									placeholder="Pilih Theme"
									className="w-full md:w-20rem"
								/>
							</div>
							<div className="md:flex flex-column pb-8 align-items-start  gap-4 px-4">
								<div className="w-12 md:flex gap-4  w-12 flex-order-1">
									<div className="overflow-auto  border-chart flex-order-2 md:flex-1 p-4 border-round-2xl  ">
										<h2 className="title">Performa Konten</h2>
										<div style={{ height: "20rem", width: "40rem" }}>
											<Chart
												style={{ height: "20rem" }}
												type="line"
												data={chartData}
												options={chartOptions}
											/>
										</div>
										<i
											className="pi pi-window-maximize cursor-pointer"
											style={{ fontSize: "1.2rem" }}
											onClick={() => setShowChartZoom(true)}
										/>
									</div>

									<div className="overflow-auto  border-chart  p-4 border-round-2xl  md:flex-1  flex-order-1">
										<h2 className="title">Total Engagement</h2>
										<div style={{ height: "20rem", width: "40rem" }}>
											<Chart
												type="bar"
												data={chartData2}
												options={chartOptions2}
											/>
										</div>

										<i
											className="pi pi-window-maximize cursor-pointer"
											style={{ fontSize: "1.2rem" }}
											onClick={() => setShowChartZoom2(true)}
										/>
									</div>
								</div>
								<div className="md:w-12 flex gap-4 flex-column w-12 flex-order-2">
									<div className="overflow-auto">
										{/* <table className="min-w-full border border-gray-300">
										<thead className="bg-gray-100">
											<tr>
												<th className="border px-4 py-2">Theme</th>
												<th className="border px-4 py-2">Status</th>
												<th className="border px-4 py-2">Likes</th>
												<th className="border px-4 py-2">Comments</th>
												<th className="border px-4 py-2">Views</th>
												<th className="border px-4 py-2">Score</th>
												<th className="border px-4 py-2">Caption</th>
											</tr>
										</thead>
										<tbody>
											{reports.map((report) => (
												<tr key={report.uuid}>
													<td className="border px-4 py-2">
														{report.theme?.name || "-"}
													</td>
													<td className="border px-4 py-2">{report.status}</td>
													<td className="border px-4 py-2">{report.likes}</td>
													<td className="border px-4 py-2">
														{report.comments}
													</td>
													<td className="border px-4 py-2">
														{report.video_views}
													</td>
													<td className="border px-4 py-2">
														{report.score ?? "-"}
													</td>
													<td className="border px-4 py-2">
														{report.description_caption?.length > 50
															? report.description_caption.slice(0, 50) + "..."
															: report.description_caption}
													</td>
												</tr>
											))}
										</tbody>
									</table> */}
										<div className="card my-8">
											{!reports ? (
												<Skeleton width="100%" height="10rem" />
											) : reports?.length === 0 ? (
												<div className="flex justify-center items-center">
													<img
														src="assets/public/nodatanew.svg"
														alt="No Data"
														style={{ width: "200px", height: "200px" }}
													/>
												</div>
											) : (
												<DataTable
													value={reports}
													resizableColumns
													showGridlines
													tableStyle={{ minWidth: "50rem" }}
													paginator
													rows={20}
													responsiveLayout="scroll"
												>
													<Column
														field="theme.name"
														header="Theme"
														sortable
													></Column>
													<Column
														field="status"
														header="Status"
														sortable
													></Column>
													<Column
														field="likes"
														header="Likes"
														sortable
													></Column>
													<Column
														field="comments"
														header="Comments"
														sortable
													></Column>
													<Column
														field="video_views"
														header="Views"
														sortable
													></Column>
													<Column
														field="score"
														header="Score"
														sortable
														body={(row) => row.score ?? "-"}
													></Column>
													<Column
														header="Caption"
														body={(row) =>
															row.description_caption?.length > 50
																? row.description_caption.slice(0, 50) + "..."
																: row.description_caption
														}
													></Column>
												</DataTable>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</Dialog>
				{/* Dialog khusus untuk zoom chart */}
				<Dialog
					visible={showChartZoom}
					style={{ width: "90vw", height: "90vh" }}
					onHide={() => setShowChartZoom(false)}
					header="Performa Konten"
				>
					<Chart
						style={{ width: "100%", height: "100%" }}
						type="line"
						data={chartData}
						options={chartOptions}
					/>
				</Dialog>
				<Dialog
					visible={showChartZoom2}
					style={{ width: "90vw", height: "90vh" }}
					onHide={() => setShowChartZoom2(false)}
					header="Total Engagement"
				>
					<Chart
						style={{ height: "100%", width: "100%" }}
						type="bar"
						data={chartData2}
						options={chartOptions2}
					/>
				</Dialog>
				<Dialog
					visible={showDetailUser}
					style={{ width: "40vw" }}
					showHeader={false}
					className="border-round-xl  p-1 bg-white"
					breakpoints={{ "960px": "75vw", "641px": "100vw" }}
					contentStyle={{
						padding: "0",
					}}
				>
					<div className="w-12  relative custom-dialog-profile-main border-round-lg border-chart">
						<div className="w-12  flex border-round-top-lg  justify-content-end  custom-dialog-profile">
							<i
								className="pi  cursor-pointer m-4 pi-times"
								onClick={() => setDetailUser(false)}
								style={{ fontSize: "1.5rem", color: "white" }}
							></i>
						</div>
						<div className="  w-12 justify-content-center flex-column flex  align-items-start">
							<div
								style={{
									marginTop: "-1rem",
									width: "6rem",
									height: "6rem",
									borderRadius: "50%",
									background: "#fff",
								}}
								className="z-5 mx-4 zoomin animation-duration-1000 absolute shadow-2  -mt-3 overflow-hidden border-circle "
							>
								{" "}
								{user?.url_foto_profile ? (
									<Image
										src={user?.url_foto_profile}
										alt="Preview Foto Profile"
										width="100%"
										height="100%"
										preview
										onClick={() => setDetailUser(true)}
									/>
								) : (
									<Avatar
										shape="circle"
										style={{ width: "6rem", height: "6rem" }}
									>
										<i
											className="pi pi-user"
											style={{ color: "#708090", fontSize: "2.5rem" }}
										></i>
									</Avatar>
								)}
							</div>
						</div>
						<div className="py-4 border-round-3xl w-12 mt-8 flex gap-6 flex-order-1 px-4   flex-column ">
							<div className="w-12 flex gap-4">
								<FloatLabel className="flex-1  fadeinleft animation-duration-1000">
									<InputText
										name="name"
										required
										id="name"
										value={user?.name || ""}
										disabled
										className=":p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="name">
										Nama
									</label>
								</FloatLabel>
								<FloatLabel className="flex-1  fadeinleft animation-duration-1000">
									<InputText
										name="email"
										required
										id="email"
										value={user?.email || ""}
										disabled
										className=":p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="name">
										Email
									</label>
								</FloatLabel>
							</div>
							<div className="w-12 flex gap-4">
								<FloatLabel className="flex-1  fadeinleft animation-duration-1000">
									<InputText
										name="sosmed_utama"
										required
										id="sosmed_utama"
										value={user?.sosmed_utama || ""}
										disabled
										className=":p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="name">
										Sosmed Utama
									</label>
								</FloatLabel>
								<FloatLabel className="flex-1  fadeinleft animation-duration-1000">
									<InputText
										name="nama_akun"
										value={user?.nama_akun || ""}
										required
										id="nama_akun"
										disabled
										className=":p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="linkmedsos">
										Nama Akun
									</label>
								</FloatLabel>
							</div>
							<div className="w-12 flex gap-4">
								<FloatLabel className="flex-1  fadeinleft animation-duration-1000">
									<InputText
										name="jumlah_follower_terakhir"
										required
										id="jumlah_follower_terakhir"
										disabled
										value={user?.jumlah_follower_terakhir || ""}
										className=":p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="name">
										Jumlah Follower Terakhir
									</label>
								</FloatLabel>
								<FloatLabel className="flex-1  fadeinleft animation-duration-1000">
									<InputText
										name="kota"
										value={user?.kota || ""}
										required
										id="kota"
										disabled
										className=":p-inputtext-sm md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="linkmedsos">
										Kota
									</label>
								</FloatLabel>
							</div>
							<div className="w-12 flex gap-4">
								<FloatLabel className="flex-1  fadeinleft animation-duration-1000">
									<InputText
										name="kelas"
										required
										id="kelas"
										value={user?.kelas || ""}
										disabled
										className=":p-inputtext-sm disabled md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="name">
										Kelas
									</label>
								</FloatLabel>
								<FloatLabel className="flex-1  fadeinleft animation-duration-1000">
									<InputText
										name="sekolah"
										value={user?.sekolah || ""}
										required
										id="sekolah"
										disabled
										className=":p-inputtext-sm disabled md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="linkmedsos">
										Sekolah
									</label>
								</FloatLabel>
							</div>
							<div className="w-12 flex gap-4">
								<FloatLabel className="flex-1  fadeinleft animation-duration-1000">
									<InputText
										name="interest_minat"
										required
										disabled
										id="interest_minat"
										value={user?.interest_minat || ""}
										className=":p-inputtext-sm  md:p-inputtext-md w-full"
									/>
									<label className="lufga" htmlFor="name">
										Interest Minat
									</label>
								</FloatLabel>
							</div>
							<div className="w-12 flex gap-4">
								<Button
									text
									raised
									label={"View Profile"}
									className="flex-1 fadeinleft animation-duration-1000"
									onClick={() => {
										if (user?.linkmedsos)
											window.open(user.linkmedsos, "_blank");
									}}
								/>
							</div>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
);

export default DetailModalUser;
