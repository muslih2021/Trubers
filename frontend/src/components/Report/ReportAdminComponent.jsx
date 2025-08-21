import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { useSelector } from "react-redux";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import StatusChip from "../StatusChip";
import dayjs from "dayjs";
import { addLocale } from "primereact/api";
import "dayjs/locale/id";
import { Avatar } from "primereact/avatar";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import ReportAdminFormModal from "./ReportAdminFormModal";
import { NavLink } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL_BACKEND;
const fetcher = async (url) => (await axios.get(url)).data;

// Setup locale dayjs
dayjs.locale("id");
addLocale("id", { today: "Hari Ini", clear: "Hapus" });

const ReportAdminComponent = () => {
	const { user } = useSelector((state) => state.auth);
	const toast = useRef(null);

	const [query, setQuery] = useState("");
	const [keyword, setKeyword] = useState("");
	const [userSuggestions, setUserSuggestions] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [dates, setDates] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [saveData, setSaveData] = useState(null);
	const [msg, setMsg] = useState("");
	const ModalRef = useRef(null);
	const [isDinilai, setisDinilai] = useState(null);
	const [export2, setExport2] = useState(false);
	const [status] = useState([
		{ label: "Semua", value: "Semua" },
		{ label: "Dinilai", value: "dinilai" },
		{ label: "Belum Dinilai", value: "belum" },
	]);
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
			await axios.put(
				`${API_URL}/ContentReport/edit/${userData.uuid}`,
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

	const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");
	const formatDate2 = (dateStr) => {
		const date = new Date(dateStr);
		return date.toLocaleString("id-ID", {
			day: "2-digit",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};
	const startDate = dates?.[0] ? formatDate(dates[0]) : "";
	const endDate = dates?.[1] ? formatDate(dates[1]) : "";

	// Pagination
	const [paginationState, setPaginationState] = useState({
		page: 0,
		limit: 6,
	});
	const { page, limit } = paginationState;
	// sortir
	const [sortField, setSortField] = useState("id");
	const [sortOrder, setSortOrder] = useState(1);
	const handleSortChange = (e) => {
		const { sortField: field, sortOrder: order } = e;

		if (field && (order === 1 || order === -1)) {
			setSortField(field);
			setSortOrder(order === 1 ? "ASC" : "DESC");
		} else {
			setSortField(null);
			setSortOrder(null);
		}
	};
	const [processingData, setProcessingData] = useState(null);

	// fetch data utama
	// const { data, error, mutate } = useSWR(
	// 	`${API_URL}/ContentReport?status=${
	// 		isDinilai ?? ""
	// 	}&search_query=${keyword}&userId=${
	// 		selectedUser?.id || ""
	// 	}&page=${page}&limit=${limit}&start_date=${startDate}&end_date=${endDate}&sort=${sortField}&order=${sortOrder}`,
	// 	fetcher
	// );
	const [selectedTheme, setSelectedTheme] = useState(null);
	const themeParam = selectedTheme ? `&themeId=${selectedTheme}` : "";
	const { data, error, mutate } = useSWR(
		`${API_URL}/ContentReport?status=${
			isDinilai ?? ""
		}&search_query=${keyword}&userId=${
			selectedUser?.id || ""
		}${themeParam}&page=${page}&limit=${limit}&start_date=${startDate}&end_date=${endDate}&sort=${sortField}&order=${sortOrder}`,
		fetcher
	);

	const { data: themeList } = useSWR(`${API_URL}/theme`, fetcher); // Ambil daftar theme

	// fetch user list
	const { data: userList } = useSWR(`${API_URL}/ContentReportuser`, fetcher);

	const searchData = (e) => {
		e.preventDefault();
		setPaginationState((prev) => ({ ...prev, page: 0 }));
		setKeyword(query);
	};

	const onPageChange = (e) => {
		setPaginationState({ page: e.page, limit: e.rows });
	};

	const searchUser = (event) => {
		const q = event.query.toLowerCase();
		const filtered = userList?.filter((u) => u.name.toLowerCase().includes(q));
		setUserSuggestions(filtered);
	};

	const onUserSelect = (e) => {
		setSelectedUser(e.value);
		setPaginationState((prev) => ({ ...prev, page: 0 }));
	};

	const isVerifiedFilterHeader = (
		<div className="flex align-items-center gap-1">
			<p className="m-0">Status</p>
			<Dropdown
				id="isDinilai"
				value={isDinilai}
				options={status}
				onChange={(e) => {
					setisDinilai(e.value);
					setPaginationState((prev) => ({ ...prev, page: 0 }));
				}}
				optionLabel="label"
				placeholder=" "
				optionValue="value"
				valueTemplate={() => (
					<i
						className={`pi pi-filter ${isDinilai ? "active-filter" : ""}`}
						style={{ fontSize: "1rem" }}
					/>
				)}
				className="dropdown-icon-only custom-clear-right"
			/>
		</div>
	);
	// element
	const actionBodyTemplate = (rowData) => {
		return (
			<div className="flex  align-items-center gap-2">
				<i
					className="pi pi-pencil"
					style={{ color: "var(--blue-300)", cursor: "pointer" }}
					onClick={(e) => {
						e.stopPropagation();
						openEditModal(rowData.uuid);
					}}
				/>
				<Button
					icon={
						processingData === rowData.uuid
							? "pi pi-spin pi-spinner"
							: "pi pi-trash"
					}
					className="p-button-text"
					style={{
						padding: 0,
						margin: 0,
						width: "auto",
						color: "var(--red-400)",
					}}
					disabled={processingData === rowData.uuid}
					onClick={(e) => {
						e.stopPropagation();
						deleteUser(rowData.uuid);
					}}
				/>
			</div>
		);
	};
	const statusBodyTemplate = (rowData) => {
		return (
			<div className="flex justify-content-center">
				<Tag
					value={rowData.status}
					severity={rowData.status === "belum" ? "danger" : "success"}
					rounded
				/>
			</div>
		);
	};
	const urlBodyTemplate = (rowData) => {
		return (
			<a
				href={rowData.url_postingan}
				target="_blank"
				rel="noopener noreferrer"
				className="flex justify-content-center no-underline"
			>
				<Tag value={rowData.url_postingan} severity="success" rounded />
			</a>
		);
	};
	// Kolom DataTable
	const allColumns = [
		{ field: "id", header: "Id", sortable: true },
		{ field: "url_postingan", header: "Postingan", sortable: true },
		{ field: "description_caption", header: "Deskripsi", sortable: true },
		{ field: "likes", header: "Like", sortable: true },
		{ field: "comments", header: "comments", sortable: true },
		{ field: "video_views", header: "Views", sortable: true },
		{ field: "score", header: "Score", sortable: true },
		{ field: "user.name", header: "User", sortable: true },
		{
			field: "status",
		},
		{ field: "Actions", header: "Actions" },
		{
			field: "createdAt",
			header: "Created At",
			sortable: true,
		},
		{
			field: "updatedAt",
			header: "Updated At",
			sortable: true,
		},
	];
	// Default kolom yang mau ditampilkan pertama kali
	const defaultSelected = allColumns.filter((col) =>
		[
			"id",
			"user.name",
			"url_postingan",
			"description_caption",
			"likes",
			"comments",
			"video_views",
			"score",
			"status",
			"Actions",
		].includes(col.field)
	);
	const saveAsExcelFile = (buffer, fileName) => {
		import("file-saver").then((module) => {
			if (module && module.default) {
				let EXCEL_TYPE =
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
				let EXCEL_EXTENSION = ".xlsx";
				const data = new Blob([buffer], {
					type: EXCEL_TYPE,
				});

				module.default.saveAs(
					data,
					fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
				);
			}
		});
	};
	// Export ke Excel
	const exportExcel = () => {
		import("xlsx").then((xlsx) => {
			if (!data) return;

			// Ambil array dari data.response
			const rows = Array.isArray(data.response) ? data.response : [];

			// Ambil field yang dipilih user
			const exportFields = selectedColumns.map((col) => col.field);

			// Filter data sesuai field terpilih
			const filteredUsers = rows.map((user) => {
				const filteredUser = {};
				exportFields.forEach((field) => {
					if (field.includes(".")) {
						const parts = field.split(".");
						let value = user;
						parts.forEach((p) => {
							value = value ? value[p] : null;
						});
						filteredUser[field] = value;
					} else {
						filteredUser[field] =
							user[field] !== undefined ? user[field] : null;
					}
				});
				return filteredUser;
			});

			// Buat file Excel
			const worksheet = xlsx.utils.json_to_sheet(filteredUsers);
			const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
			const excelBuffer = xlsx.write(workbook, {
				bookType: "xlsx",
				type: "array",
			});
			saveAsExcelFile(excelBuffer, "Data");
		});
	};

	useEffect(() => {
		if (export2 === true) {
			exportExcel();
			setExport2(false);
		}
	}, [export2]);

	const deleteUser = async (uuid) => {
		console.log("🗑️ Tombol delete diklik untuk uuid:", uuid); // ✅ cek apakah fungsi terpanggil

		confirmDialog({
			message: "Do you want to delete this record?",
			header: "Delete Confirmation",
			icon: "pi pi-info-circle",
			defaultFocus: "reject",
			acceptClassName: "p-button-danger",
			accept: async () => {
				try {
					console.log("✅ User mengkonfirmasi delete untuk uuid:", uuid); // cek saat accept ditekan
					setProcessingData(uuid);
					await axios.delete(`${API_URL}/ContentReport/${uuid}`);
					toast.current.show({
						severity: "success",
						summary: "Deleted",
						detail: "User has been deleted",
						life: 3000,
					});
					mutate();
				} catch (error) {
					console.error("❌ Error deleting user:", error);
					toast.current.show({
						severity: "error",
						summary: "Error",
						detail: "Failed to delete user",
						life: 3000,
					});
				} finally {
					setProcessingData(null);
				}
			},
			reject: () => {
				console.log("⚠️ User membatalkan delete untuk uuid:", uuid); // cek saat reject ditekan
				toast.current.show({
					severity: "warn",
					summary: "Cancelled",
					detail: "You have cancelled",
					life: 3000,
				});
			},
		});
	};

	// State pakai defaultSelected
	const [selectedColumns, setSelectedColumns] = useState(defaultSelected);

	const onColumnToggle = (e) => {
		const selected = e.value;
		const orderedSelected = allColumns.filter((col) =>
			selected.some((s) => s.field === col.field)
		);
		setSelectedColumns(orderedSelected);
	};
	useEffect(() => {
		console.log("Filter status berubah:", isDinilai);
	}, [isDinilai]);
	if (error) return <div>Gagal memuat data</div>;

	const items = data?.response || [];

	return (
		<div className="profile min-w-full md:flex md:flex-column px-3 md:px-6  justify-content-start gap-0">
			<h1 className="lufga-extrabold text-3xl md:text-5xl mb-3">
				Content Report
			</h1>
			<ConfirmDialog />
			{/* Filter */}
			<div className="border-round-xl md:my-4 mb-8 gradient-border md:-mt-3 py-3 px-3 md:px-6 md:py-2 md:pl-4 shadow-4 w-full">
				<div className="flex flex-wrap md:flex-nowrap my-2 md:justify-content-between justify-content-center align-items-center">
					<div className="flex flex-column md:flex-row w-12 my-4  gap-3">
						<form onSubmit={searchData} className="md:my-0 md:flex-1 ">
							<IconField iconPosition="left">
								<InputIcon className="pi pi-search" />
								<InputText
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									placeholder="Cari deskripsi konten"
									className="w-full"
								/>
							</IconField>
						</form>
						<div className="flex align-items-center gap-2">
							<Dropdown
								value={selectedTheme}
								options={themeList?.response || []}
								optionLabel="name"
								optionValue="id"
								placeholder="Filter berdasarkan tema"
								onChange={(e) => {
									setSelectedTheme(e.value);
									setPaginationState((prev) => ({ ...prev, page: 0 }));
								}}
								className="w-full"
							/>
							{selectedTheme && (
								<Button
									icon="pi pi-times"
									className="p-button-outlined p-button-secondary"
									onClick={() => setSelectedTheme(null)}
									tooltip="Reset Tema"
									tooltipOptions={{ position: "top" }}
								/>
							)}
						</div>
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
											setPaginationState((prev) => ({ ...prev, page: 0 }));
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
												<span className="text-xs">{user.linkmedsos}</span>
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
						<div className="flex align-items-center gap-2">
							<Calendar
								value={dates}
								onChange={(e) => {
									setDates(e.value);
									setPaginationState((prev) => ({ ...prev, page: 0 }));
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

						{/* Column Toggle */}
						<Button severity="danger" text raised className="p-0 m-0">
							<MultiSelect
								value={selectedColumns}
								options={allColumns}
								onChange={onColumnToggle}
								optionLabel="header"
								className="md:w-auto p-2 m-0 w-full"
								pt={{
									trigger: { style: { width: "auto", padding: "0 0" } },
								}}
								dropdownIcon={
									<div className="flex p-0 m-0">
										<i className="pi pi-objects-column md:flex hidden text-2xl" />
										<h4 className="md:hidden flex p-0 m-0">Pilih Kolom</h4>
									</div>
								}
							/>
						</Button>
						<i
							className="pi pi-file-export p-2"
							style={{ cursor: "pointer", fontSize: "2rem", color: "#708090" }}
							onClick={() => setExport2(true)}
						/>
					</div>
				</div>
				{/* Data Table */}
				<div className="my-4 w-12">
					{!data ? (
						<Skeleton width="100%" height="10rem" />
					) : items.length === 0 ? (
						<DataTable value={items} tableStyle={{ minWidth: "50rem" }}>
							{selectedColumns.map((col) => {
								if (col.field === "user.name") {
									return (
										<Column
											key={col.field}
											field="user.name"
											header={col.header}
											body={<Skeleton />}
										/>
									);
								}
								if (col.field === "status") {
									return (
										<Column
											key={col.field}
											header={isVerifiedFilterHeader}
											body={<Skeleton />}
										/>
									);
								}
								if (col.field === "Actions") {
									return (
										<Column
											key={col.field}
											header="Actions"
											body={<Skeleton />}
										/>
									);
								}
								return (
									<Column
										key={col.field}
										field={col.field}
										header={col.header}
									/>
								);
							})}
						</DataTable>
					) : (
						<DataTable
							value={items}
							removableSort
							resizableColumns
							showGridlines
							tableStyle={{ minWidth: "50rem" }}
							lazy
							loading={!items}
							sortField={sortField}
							sortOrder={
								sortOrder === "ASC" ? 1 : sortOrder === "DESC" ? -1 : null
							}
							onSort={handleSortChange}
						>
							{selectedColumns.map((col) => {
								if (col.field === "Actions") {
									return (
										<Column
											key={col.field}
											header="Actions"
											body={actionBodyTemplate}
										/>
									);
								}
								if (col.field === "createdAt") {
									return (
										<Column
											key={col.field}
											header="Created At"
											body={(rowData) => formatDate2(rowData.createdAt)}
										/>
									);
								}
								if (col.field === "updatedAt") {
									return (
										<Column
											key={col.field}
											header="Updated At"
											body={(rowData) => formatDate2(rowData.updatedAt)}
										/>
									);
								}
								if (col.field === "status") {
									return (
										<Column
											key={col.field}
											header={isVerifiedFilterHeader}
											body={statusBodyTemplate}
										/>
									);
								}
								if (col.field === "url_postingan") {
									return (
										<Column
											key={col.field}
											header="url_postingan"
											body={urlBodyTemplate}
										/>
									);
								}
								return (
									<Column
										key={col.field}
										field={col.field}
										header={col.header}
										sortable={col.sortable}
										body={col.body}
									/>
								);
							})}
						</DataTable>
					)}
					<div className="md:flex my-2 justify-content-between align-items-center">
						<p
							style={{ color: "var(--surface-400)" }}
							className="lufga text-xs text-justify md:text-sm   md:text-left"
						>
							Total Data: {data?.totalRows} | Halaman: {page + 1} dari{" "}
							{data?.totalPage}
						</p>
						<Paginator
							className="p-0 m-0"
							first={page * limit}
							rows={limit}
							totalRecords={data?.totalRows || 0}
							rowsPerPageOptions={[1, 6, 12, 20, 30, 80, 100]}
							onPageChange={onPageChange}
						/>
					</div>
				</div>

				<Toast ref={toast} />
				<ReportAdminFormModal
					ref={ModalRef}
					isOpen={isModalOpen}
					saveData={saveData}
					closeModal={() => setIsModalOpen(false)}
					user={editingUser}
					saveUser={updateUser}
					msg={msg}
				/>
			</div>
		</div>
	);
};

export default ReportAdminComponent;
