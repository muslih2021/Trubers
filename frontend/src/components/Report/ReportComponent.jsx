import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import useSWR, { mutate as globalMutate } from "swr";
import { useNavigate, NavLink } from "react-router-dom";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { TabView, TabPanel } from "primereact/tabview";
import { Paginator } from "primereact/paginator";
import { useSelector } from "react-redux";
import { AutoComplete } from "primereact/autocomplete";
import { Avatar } from "primereact/avatar";
import dayjs from "dayjs";
import StatusChip from "../StatusChip";
import { addLocale } from "primereact/api";
import "dayjs/locale/id";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { TbMailPlus } from "react-icons/tb";
import ReportFormModal from "./ReportFormModal";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";

const API_URL = import.meta.env.VITE_API_URL_BACKEND;

const fetcher = async (url) => (await axios.get(url)).data;
const statusLabelMap = {
	dinilai: "DiNilai",
	belum: "Belum DiNilai",
	Semua: "Semua",
};

const tabOrder = ["Semua", "belum", "dinilai"];

// Locale & date setup
dayjs.locale("id");
addLocale("id", {
	firstDayOfWeek: 1,
	dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
	dayNamesShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
	dayNamesMin: ["Mg", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"],
	monthNames: [
		"Januari",
		"Februari",
		"Maret",
		"April",
		"Mei",
		"Juni",
		"Juli",
		"Agustus",
		"September",
		"Oktober",
		"November",
		"Desember",
	],
	monthNamesShort: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"Mei",
		"Jun",
		"Jul",
		"Agu",
		"Sep",
		"Okt",
		"Nov",
		"Des",
	],
	today: "Hari Ini",
	clear: "Hapus",
});

const ReportComponent = () => {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [keyword, setKeyword] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);
	const [userSuggestions, setUserSuggestions] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const { user } = useSelector((state) => state.auth);
	const [dates, setDates] = useState(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [newUser, setNewUser] = useState({ url_postingan: "" });
	const [msg, setMsg] = useState("");
	const toast = useRef(null);
	const ModalRef = useRef(null);
	const [saveData, setSaveData] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");
	const startDate = dates?.[0] ? formatDate(dates[0]) : "";
	const endDate = dates?.[1] ? formatDate(dates[1]) : "";
	const { data: themes } = useSWR(`${API_URL}/theme`, fetcher);

	// Pagination state per tab
	const [paginationState, setPaginationState] = useState(
		tabOrder.reduce((acc, key) => {
			acc[key] = { page: 0, limit: 6 };
			return acc;
		}, {})
	);

	const currentStatus = tabOrder[activeIndex];
	const { page, limit } = paginationState[currentStatus];

	// Fetch data utama
	const { data, error, mutate } = useSWR(
		`${API_URL}/ContentReport?status=${currentStatus}&search_query=${keyword}&userId=${
			selectedUser?.id || ""
		}&page=${page}&limit=${limit}&start_date=${startDate}&end_date=${endDate}`,
		fetcher
	);

	// Fetch daftar user untuk filter
	const { data: userList } = useSWR(`${API_URL}/ContentReportuser`, fetcher);

	// Search bar submit
	const searchData = (e) => {
		e.preventDefault();
		setPaginationState((prev) => ({
			...prev,
			[currentStatus]: { ...prev[currentStatus], page: 0 },
		}));
		setKeyword(query);
	};

	const onPageChange = (e) => {
		setPaginationState((prev) => ({
			...prev,
			[currentStatus]: { ...prev[currentStatus], page: e.page, limit: e.rows },
		}));
	};

	const searchUser = (event) => {
		const q = event.query.toLowerCase();
		const filtered = userList?.filter((u) => u.name.toLowerCase().includes(q));
		setUserSuggestions(filtered);
	};

	const onUserSelect = (e) => {
		setSelectedUser(e.value);
		setPaginationState((prev) => ({
			...prev,
			[currentStatus]: { ...prev[currentStatus], page: 0 },
		}));
	};

	const addUser = async (userData) => {
		try {
			setSaveData(userData);
			await axios.post(`${API_URL}/ContentReport`, userData);
			setIsAddModalOpen(false);
			toast.current.show({
				severity: "success",
				summary: "Berhasil",
				detail: "Berhasil Mengajukan Postingan",
				life: 3000,
			});
			mutate(); // ✅ refresh data list
		} catch (error) {
			if (error.response) {
				setMsg(error.response.data.msg);
			}
		} finally {
			setSaveData(null);
		}
	};
	const openEditModal = async (uuid) => {
		try {
			const response = await axios.get(`${API_URL}/ContentReport/${uuid}`);
			setEditingUser({ ...response.data });
			console.log(response.data);
			setIsModalOpen(true);
		} catch (error) {
			console.error("Error fetching user details:", error);
		}
	};
	const updateUser = async (userData) => {
		try {
			setSaveData(userData);
			await axios.patch(
				`${API_URL}/ContentReport/status/${userData.uuid}`,
				userData
			);
			setIsModalOpen(false);
			toast.current.show({
				severity: "success",
				summary: "Update",
				detail: "Content Link has been updated",
				life: 3000,
			});
			mutate();
		} catch (error) {
			if (error.response) {
				setMsg(error.response.data.msg);
			}
		} finally {
			setSaveData(null);
		}
	};

	useEffect(() => {
		// Load script embed Instagram kalau belum ada
		if (!document.querySelector('script[src="//www.instagram.com/embed.js"]')) {
			const script = document.createElement("script");
			script.src = "//www.instagram.com/embed.js";
			script.async = true;
			document.body.appendChild(script);
		}
	}, []);

	useEffect(() => {
		// Proses ulang embed setelah data dimuat
		if (window.instgrm) {
			window.instgrm.Embeds.process();
		}
	}, [data]);

	// if (!data && !error) return <div>Loading...</div>;
	if (error) return <div>Gagal memuat data</div>;

	return (
		<div className="profile min-w-full md:flex md:mb-0 mb-8 md:flex-column px-3 md:px-6 justify-content-center gap-0">
			<h1 className="lufga-extrabold md:text-5xl text-title text-3xl">
				Content Report
			</h1>

			{/* Filter */}
			<div className="lufga border-round-xl md:my-4 my-2 gradient-border py-3 px-3 md:px-6 md:py-2 md:pl-4 shadow-4 flex flex-column justify-content-center align-items-center w-full">
				<div className="flex w-full md:flex-row flex-column md:mt-4 mt-2 gap-3 justify-content-between">
					{/* Search */}
					<form onSubmit={searchData} className="flex-1">
						<IconField iconPosition="left">
							<InputIcon className="pi pi-search" />
							<InputText
								type="text"
								className="input w-full"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Cari berdasarkan deskripsi Konten"
							/>
						</IconField>
						<button className="hidden" type="submit">
							Cari
						</button>
					</form>

					{/* Filter user */}
					{user?.role === "admin" ? (
						<div className="flex align-items-center gap-2">
							<AutoComplete
								className="w-full"
								inputClassName="w-full"
								field="name"
								value={selectedUser}
								suggestions={userSuggestions}
								completeMethod={searchUser}
								onChange={(e) => {
									if (typeof e.value === "string") {
										setSelectedUser(null);
									} else {
										setSelectedUser(e.value);
										setPaginationState((prev) => ({
											...prev,
											[currentStatus]: { ...prev[currentStatus], page: 0 },
										}));
									}
								}}
								onSelect={onUserSelect}
								placeholder="Filter berdasarkan user"
								itemTemplate={(user) => (
									<div className="flex align-items-center gap-2">
										<Avatar
											image={user.url_foto_profile}
											size="small"
											shape="circle"
										/>
										<div className="flex flex-column">
											<span className="text-sm font-medium">{user.name}</span>
											<span className="text-xs">{user.nik}</span>
										</div>
									</div>
								)}
							/>
							{selectedUser && (
								<Button
									icon="pi pi-times"
									style={{ color: "red" }}
									className="p-button-outlined p-button-secondary px-3"
									onClick={() => setSelectedUser(null)}
									tooltip="Reset User"
									tooltipOptions={{ position: "top" }}
								/>
							)}
						</div>
					) : null}

					{/* Filter tanggal */}
					<div className="flex align-items-center gap-2">
						<Calendar
							value={dates}
							onChange={(e) => {
								setDates(e.value);
								setPaginationState((prev) => ({
									...prev,
									[currentStatus]: { ...prev[currentStatus], page: 0 },
								}));
							}}
							selectionMode="range"
							readOnlyInput
							className="w-full"
							inputClassName="w-full"
							hideOnRangeSelection
							showIcon
							placeholder="Pilih Rentang Tanggal"
							locale="id"
						/>
						{dates && (
							<Button
								icon="pi pi-times"
								style={{ color: "red" }}
								className="p-button-outlined p-button-secondary"
								onClick={() => setDates(null)}
								tooltip="Reset Tanggal"
								tooltipOptions={{ position: "top" }}
							/>
						)}
					</div>

					{/* Tombol tambah */}
					{user?.role === "user" ? (
						<Button
							onClick={() => setIsAddModalOpen(true)}
							text
							raised
							severity="success"
							aria-label="Search"
							className="flex justify-content-center"
						>
							<TbMailPlus
								className="md:flex hidden"
								style={{ fontSize: "1.2rem" }}
								color="#FF0025"
							/>
							<h4 className="md:hidden text-title text-center p-0 m-0 flex">
								Tambah Postingan
							</h4>
						</Button>
					) : null}
				</div>

				{/* TabView */}
				<div className="w-full mt-4">
					<TabView
						activeIndex={activeIndex}
						onTabChange={(e) => setActiveIndex(e.index)}
						className="w-full no-padding-tabview"
						pt={{
							nav: {
								style: {
									width: "100%",
									display: "flex",
									justifyContent: "space-around",
								},
							},
							navContainer: {
								style: { width: "100%" },
							},
						}}
					>
						{tabOrder.map((status) => {
							const items =
								status === currentStatus ? data?.response || [] : [];
							return (
								<TabPanel header={statusLabelMap[status]} key={status}>
									{!data ? (
										// Kondisi loading → tampilkan skeleton card
										<div className="w-full pb-6 pt-6 justify-content-center flex flex-wrap gap-4">
											{[...Array(6)].map((_, idx) => (
												<Skeleton
													key={idx}
													width="22rem"
													height="10rem"
													className="border-round-xl"
												/>
											))}
										</div>
									) : items.length === 0 ? (
										// Kondisi data kosong
										<div className="text-center flex-column flex justify-content-center align-items-center p-4 text-sm mt-4">
											<div className="w-3">
												<img
													className="w-full h-full zoom-on-hover"
													src={
														new URL(
															`../../assets/images/nodata.svg`,
															import.meta.url
														).href
													}
													alt="No data"
												/>
											</div>
											<h2
												style={{ color: "var(--surface-400)" }}
												className="lufga"
											>
												Tidak ada data
											</h2>
										</div>
									) : (
										<div className="w-full pb-6 pt-6 justify-content-center flex flex-wrap gap-4">
											{items.map((item) => {
												const kode = item.jenis_surat?.kode_surat;

												return (
													<a
														href={item.url_postingan}
														target="_blank"
														key={item.id}
														class="card34534 cursor-pointer"
													>
														<img src={item.url_display_foto} alt="post image" />
														<div
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																openEditModal(item.uuid);
															}}
															class="editcard34534-btn cursor-pointer"
														>
															<svg
																width="14"
																height="14"
																viewBox="0 0 14 14"
																fill="currentColor"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M6.60009 11.1073L11.5308 6.17667C10.7013 5.83016 9.94793 5.32414 9.31343 4.68734C8.67632 4.05271 8.17007 3.29911 7.82343 2.46934L2.89276 7.40001C2.50809 7.78467 2.31543 7.97734 2.15009 8.18934C1.95502 8.43966 1.7876 8.71034 1.65076 8.99667C1.53543 9.23934 1.44943 9.49801 1.27743 10.014L0.369427 12.736C0.327636 12.8606 0.321436 12.9945 0.351523 13.1224C0.38161 13.2504 0.446792 13.3674 0.539742 13.4604C0.632691 13.5533 0.749724 13.6185 0.877685 13.6486C1.00565 13.6787 1.13946 13.6725 1.26409 13.6307L3.98609 12.7227C4.50276 12.5507 4.76076 12.4647 5.00343 12.3493C5.29098 12.2125 5.56009 12.046 5.81076 11.85C6.02276 11.6847 6.21543 11.492 6.60009 11.1073ZM12.8988 4.80867C13.3904 4.31705 13.6666 3.65027 13.6666 2.95501C13.6666 2.25975 13.3904 1.59296 12.8988 1.10134C12.4071 0.609717 11.7404 0.333527 11.0451 0.333527C10.3498 0.333527 9.68305 0.609717 9.19143 1.10134L8.60009 1.69267L8.62543 1.76667C8.91675 2.60053 9.39363 3.35733 10.0201 3.98001C10.6614 4.62522 11.4447 5.1115 12.3074 5.40001L12.8988 4.80867Z"
																	fill="url(#paint0_linear_31_827)"
																/>
																<defs>
																	<linearGradient
																		id="paint0_linear_31_827"
																		x1="6.99967"
																		y1="0.333527"
																		x2="6.99967"
																		y2="13.6673"
																		gradientUnits="userSpaceOnUse"
																	>
																		<stop stop-color="#FF0025" />
																		<stop offset="1" stop-color="#7149C6" />
																	</linearGradient>
																</defs>
															</svg>
														</div>
														<div class="cardcard34534-content">
															<p>{item.description_caption}</p>
															<div class="cardcard34534-footer">
																<div>
																	<i class="fa-regular fa-heart"></i>
																	{item.likes}
																</div>
																<div className="py-2 px-2">
																	<i class="fa-regular fa-comment"></i>
																	{item.comments}
																</div>
																<div>
																	<i className="fa-regular fa-eye"></i>{" "}
																	{item.video_views}
																</div>
																<div>
																	<i className="fa-solid fa-trophy"></i>{" "}
																	{item.score}
																</div>
															</div>
														</div>
													</a>
												);
											})}
										</div>
									)}

									{/* Paginator */}
									<div className="md:flex my-2 justify-content-between align-items-center">
										<p
											className="lufga text-xs md:text-sm"
											style={{ color: "var(--surface-400)" }}
										>
											Total Data: {data?.totalRows} | Halaman: {page + 1} dari{" "}
											{data?.totalPage}
										</p>
										<Paginator
											className="p-0 m-0"
											first={page * limit}
											rows={limit}
											totalRecords={data?.totalRows || 0}
											rowsPerPageOptions={[6, 12, 20, 30]}
											onPageChange={onPageChange}
										/>
									</div>
								</TabPanel>
							);
						})}
					</TabView>
				</div>

				{/* Modal */}
				<Toast ref={toast} />
				<ReportFormModal
					ref={ModalRef}
					isOpen={isAddModalOpen}
					saveData={saveData}
					closeModal={() => setIsAddModalOpen(false)}
					user={newUser}
					saveUser={addUser}
					msg={msg}
					isNew
					themes={themes}
				/>
				<ReportFormModal
					ref={ModalRef}
					isOpen={isModalOpen}
					saveData={saveData}
					closeModal={() => setIsModalOpen(false)}
					user={editingUser}
					saveUser={updateUser}
					msg={msg}
					themes={themes}
				/>
			</div>
		</div>
	);
};

export default ReportComponent;
