import React, { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Paginator } from "primereact/paginator";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);
dayjs.locale("id");

const API_URL = import.meta.env.VITE_API_URL_BACKEND;

const fetcher = async (url) => {
	const res = await axios.get(url);
	return res.data;
};

const statusLabelMap = {
	Semua: "Semua",
	belum_dibaca: "Belum Dibaca",
	dibaca: "Sudah Dibaca",
};

const tabOrder = ["Semua", "belum_dibaca", "dibaca"];

const formatStatus = (status) => {
	if (!status) return "";
	return status
		.replace(/_/g, " ")
		.replace(
			/\w\S*/g,
			(txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
		);
};

const getKeterangan = (status, namaSurat) => {
	switch (status) {
		case "menunggu_ttd":
			return `${namaSurat} telah diproses oleh admin dan sedang menunggu tanda tangan Kepala Desa.`;
		case "selesai":
			return `${namaSurat} telah selesai dan bisa dicetak.`;
		case "ditolak":
			return `Pengajuan ${namaSurat} ditolak. Silakan cek alasan penolakan.`;
		case "dibatalkan":
			return `Pengajuan ${namaSurat} telah dibatalkan.`;
		case "diproses":
			return `${namaSurat} sedang diproses oleh admin.`;
		default:
			return `Status ${namaSurat} telah diperbarui.`;
	}
};

const getStatusIcon = (status) => {
	switch (status) {
		case "diproses":
			return "pi pi-spinner";
		case "ditolak":
			return "pi pi-times-circle";
		case "menunggu_ttd":
			return "pi pi-clock";
		case "selesai":
			return "pi pi-check-circle";
		case "dibatalkan":
			return "pi pi-ban";
		default:
			return "pi pi-info-circle";
	}
};

const formatWaktuNotifikasi = (tglStr) => {
	const tgl = dayjs(tglStr);
	if (tgl.isToday()) return tgl.fromNow(); // contoh: "5 menit yang lalu"
	else if (tgl.isYesterday())
		return `Kemarin pada pukul ${tgl.format("HH:mm")}`;
	else return `${tgl.fromNow()} pada pukul ${tgl.format("HH:mm")}`;
};

const groupByTanggal = (items) => {
	const groups = {};
	items.forEach((item) => {
		const date = dayjs(item.tgl_perubahan);
		let label = date.format("DD MMMM YYYY");
		if (date.isToday()) label = "Hari Ini";
		else if (date.isYesterday()) label = "Kemarin";
		if (!groups[label]) groups[label] = [];
		groups[label].push(item);
	});
	return groups;
};

const NotifikasiComponent = () => {
	const navigate = useNavigate();
	const [activeIndex, setActiveIndex] = useState(0);

	const [paginationState, setPaginationState] = useState(
		tabOrder.reduce((acc, key) => {
			acc[key] = { page: 0, limit: 6 };
			return acc;
		}, {})
	);

	const currentStatus = tabOrder[activeIndex];
	const { page, limit } = paginationState[currentStatus];

	const { data, error, mutate } = useSWR(
		`${API_URL}/riwayatsuratnotifikasi?status=${currentStatus}&page=${page}&limit=${limit}`,
		fetcher
	);

	const onPageChange = (e) => {
		setPaginationState((prev) => ({
			...prev,
			[currentStatus]: {
				...prev[currentStatus],
				page: e.page,
				limit: e.rows,
			},
		}));
	};

	const markAsReadAndNavigate = async (id, uuid) => {
		try {
			await axios.patch(`${API_URL}/riwayatsurat/${id}/baca`);
			mutate();
			navigate(`/riwayat-surat/${uuid}`);
		} catch {
			navigate(`/riwayat-surat/${uuid}`);
		}
	};

	if (!data && !error) return <div>Loading...</div>;
	if (error) return <div>Gagal memuat data</div>;

	const items = data?.response || [];
	const grouped = groupByTanggal(items);

	const statusColorMap = {
		diproses: "#42A5F5",
		ditolak: "#EF5350",
		menunggu_ttd: "#FFB300",
		selesai: "#66BB6A",
		dibatalkan: "#9E9E9E",
	};

	return (
		<div className="profile min-w-full md:flex md:mb-0 mb-8 md:flex-column px-3 md:px-6 justify-content-center gap-0">
			<h1 className="lufga-extrabold md:text-5xl text-title text-3xl">
				Notifikasi
			</h1>

			<div className="lufga border-round-xl md:my-4 my-2 gradient-border py-3 px-3 md:px-6 md:py-2 md:pl-4 shadow-4 flex flex-column justify-content-center align-items-center w-full">
				<div className="w-full mt-4">
					<TabView
						activeIndex={activeIndex}
						onTabChange={(e) => setActiveIndex(e.index)}
						className="w-full no-padding-tabview"
						pt={{
							nav: {
								style: {
									display: "flex",
									justifyContent: "space-around",
									width: "100%",
								},
							},
						}}
					>
						{tabOrder.map((status) => (
							<TabPanel header={statusLabelMap[status]} key={status}>
								{status === currentStatus && (
									<>
										{items.length === 0 ? (
											<div className="text-center text-sm mt-4">
												Tidak ada data
											</div>
										) : (
											Object.entries(grouped).map(
												([tanggalLabel, notifikasiList]) => (
													<div key={tanggalLabel} className="mb-5 w-full">
														<h5 className="mb-3">{tanggalLabel}</h5>
														<div className="flex flex-wrap gap-4">
															{notifikasiList.map((item) => {
																const namaSurat =
																	item.pengajuansurat?.jenis_surat?.nama_surat;
																return (
																	<div
																		key={item.id}
																		onClick={() =>
																			markAsReadAndNavigate(
																				item.id,
																				item.pengajuansurat?.uuid
																			)
																		}
																		className="relative overflow-hidden cursor-pointer  card-hover border-round-xl w-full px-3 py-3 flex align-items-center hover:shadow-1 transition-duration-500 shadow-2"
																	>
																		<span
																			className="flex mx-1 w-3rem h-3rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
																			style={{
																				backgroundColor:
																					statusColorMap[item.status] ||
																					"#90A4AE",
																				aspectRatio: "1 / 1",
																			}}
																		>
																			<i
																				className={`${getStatusIcon(
																					item.status
																				)} text-2xl`}
																			/>
																		</span>

																		<div className="w-12 mx-2 flex flex-column gap-1 justify-content-center">
																			<strong
																				className="text-lg m-0 p-0"
																				style={{
																					color:
																						statusColorMap[item.status] ||
																						"#90A4AE",
																				}}
																			>
																				{formatStatus(item.status)}
																			</strong>
																			<p className="m-0 p-0 text-xs">
																				{getKeterangan(item.status, namaSurat)}
																			</p>
																			<span
																				className="text-xs m-0 p-0 "
																				style={{ color: "var(--surface-400)" }}
																			>
																				{formatWaktuNotifikasi(
																					item.tgl_perubahan
																				)}
																			</span>
																		</div>
																	</div>
																);
															})}
														</div>
													</div>
												)
											)
										)}
										<div className="md:flex my-2 justify-content-between align-items-center">
											<p
												style={{ color: "var(--surface-400)" }}
												className="lufga text-xs md:text-sm"
											>
												Total Data: {data?.totalRows} | Halaman: {page + 1} dari{" "}
												{data?.totalPage}
											</p>
											<Paginator
												first={page * limit}
												rows={limit}
												totalRecords={data?.totalRows || 0}
												rowsPerPageOptions={[6, 12, 20, 30]}
												onPageChange={onPageChange}
											/>
										</div>
									</>
								)}
							</TabPanel>
						))}
					</TabView>
				</div>
			</div>
		</div>
	);
};

export default NotifikasiComponent;
