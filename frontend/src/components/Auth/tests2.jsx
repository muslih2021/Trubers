import React, { useState, useRef } from "react";
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

const API_URL = import.meta.env.VITE_API_URL_BACKEND;
const fetcher = async (url) => (await axios.get(url)).data;

const statusOptions = [
	{ label: "Semua", value: "Semua" },
	{ label: "Belum Dinilai", value: "belum" },
	{ label: "Dinilai", value: "dinilai" },
];

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
	const [currentStatus, setCurrentStatus] = useState("Semua");

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

	// fetch data utama
	const { data, error, mutate } = useSWR(
		`${API_URL}/ContentReport?status=${currentStatus}&search_query=${keyword}&userId=${
			selectedUser?.id || ""
		}&page=${page}&limit=${limit}&start_date=${startDate}&end_date=${endDate}&sort=${sortField}&order=${sortOrder}`,
		fetcher
	);
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
				id="statusFilter"
				value={currentStatus}
				options={statusOptions}
				onChange={(e) => {
					setCurrentStatus(e.value);
					setPaginationState((prev) => ({ ...prev, page: 0 }));
				}}
				optionLabel="label"
				placeholder=" "
				optionValue="value"
				valueTemplate={() => (
					<i
						className={`pi pi-filter ${currentStatus ? "active-filter" : ""}`}
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
						// processingData === rowData.uuid
						// 	? "pi pi-spin pi-spinner"
						// 	:
						"pi pi-trash"
					}
					className="p-button-text"
					style={{
						padding: 0,
						margin: 0,
						width: "auto",
						color: "var(--red-400)",
					}}
					// disabled={processingData === rowData.uuid}
					onClick={(e) => {
						e.stopPropagation();
						// deleteUser(rowData.uuid);
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
	// Kolom DataTable
	const allColumns = [
		{ field: "id", header: "Id", sortable: true },
		{ field: "url_postingan", header: "Postingan", sortable: true },
		{ field: "description_caption", header: "Deskripsi", sortable: true },
		{ field: "likes", header: "Like", sortable: true },
		{ field: "video_views", header: "Views", sortable: true },
		{ field: "score", header: "Score", sortable: true },
		{ field: "user.name", header: "User", sortable: true },
		{
			field: "status",
			header: isVerifiedFilterHeader,
			body: statusBodyTemplate,
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
			"video_views",
			"score",
			"status",
			"Actions",
		].includes(col.field)
	);

	// State pakai defaultSelected
	const [selectedColumns, setSelectedColumns] = useState(defaultSelected);

	const onColumnToggle = (e) => {
		const selected = e.value;
		const orderedSelected = allColumns.filter((col) =>
			selected.some((s) => s.field === col.field)
		);
		setSelectedColumns(orderedSelected);
	};

	if (error) return <div>Gagal memuat data</div>;

	const items = data?.response || [];

	return (
		<div className="profile min-w-full md:flex md:flex-column px-3 md:px-6  justify-content-start gap-0">
			<h1 className="lufga-extrabold text-3xl md:text-5xl mb-3">
				Content Report
			</h1>

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
			</div>
		</div>
	);
};

export default ReportAdminComponent;
