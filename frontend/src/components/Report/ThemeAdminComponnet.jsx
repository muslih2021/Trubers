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
import dayjs from "dayjs";
import { addLocale } from "primereact/api";
import "dayjs/locale/id";
import { Avatar } from "primereact/avatar";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import ThemeAdminFormModal from "./ThemeAdminFormModal";
import { NavLink } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL_BACKEND;
const fetcher = async (url) => (await axios.get(url)).data;

// Setup locale dayjs
dayjs.locale("id");
addLocale("id", { today: "Hari Ini", clear: "Hapus" });

const ThemeAdminComponnet = () => {
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
	const openEditModal = async (id) => {
		try {
			const response = await axios.get(`${API_URL}/theme/${id}`);
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
			await axios.put(`${API_URL}/theme/${userData.id}`, userData);
			setIsModalOpen(false);
			toast.current.show({
				severity: "success",
				summary: "Update",
				detail: "Theme has been updated",
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
	const { data, error, mutate } = useSWR(
		`${API_URL}/theme?search_query=${keyword}&page=${page}&limit=${limit}&sort=${sortField}&order=${sortOrder}`,
		fetcher
	);

	const searchData = (e) => {
		e.preventDefault();
		setPaginationState((prev) => ({ ...prev, page: 0 }));
		setKeyword(query);
	};

	const onPageChange = (e) => {
		setPaginationState({ page: e.page, limit: e.rows });
	};

	// element
	const actionBodyTemplate = (rowData) => {
		return (
			<div className="flex  align-items-center gap-2">
				<i
					className="pi pi-pencil"
					style={{ color: "var(--blue-300)", cursor: "pointer" }}
					onClick={(e) => {
						e.stopPropagation();
						openEditModal(rowData.id);
					}}
				/>
				{/* <Button
					icon={
						processingData === rowData.id
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
					disabled={processingData === rowData.id}
					onClick={(e) => {
						e.stopPropagation();
						deleteUser(rowData.id);
					}}
				/> */}
			</div>
		);
	};
	const statusBodyTemplate = (rowData) => {
		return (
			<div className="flex justify-content-center">
				<Tag
					value={rowData.status}
					severity={rowData.status === "tidak aktif" ? "danger" : "success"}
					rounded
				/>
			</div>
		);
	};

	// Kolom DataTable
	const allColumns = [
		{ field: "id", header: "Id", sortable: true },
		{ field: "name", header: "name", sortable: true },
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
		["id", "name", "status", "Actions"].includes(col.field)
	);

	const deleteUser = async (id) => {
		confirmDialog({
			message: "Do you want to delete this record?",
			header: "Delete Confirmation",
			icon: "pi pi-info-circle",
			defaultFocus: "reject",
			acceptClassName: "p-button-danger",
			accept: async () => {
				try {
					setProcessingData(id);
					await axios.delete(`${API_URL}/theme/${id}`);
					toast.current.show({
						severity: "success",
						summary: "Deleted",
						detail: "Theme has been deleted",
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
				console.log("⚠️ User membatalkan delete untuk id:", id);
				toast.current.show({
					severity: "warn",
					summary: "Cancelled",
					detail: "You have cancelled",
					life: 3000,
				});
			},
		});
	};

	const createTheme = async (newTheme) => {
		try {
			setSaveData(newTheme); // menandakan proses loading
			await axios.post(`${API_URL}/theme`, newTheme); // POST ke backend
			setIsModalOpen(false); // tutup modal
			toast.current.show({
				severity: "success",
				summary: "Berhasil",
				detail: "Tema berhasil ditambahkan",
				life: 3000,
			});
			mutate(); // refresh data
		} catch (error) {
			if (error.response) setMsg(error.response.data.msg);
		} finally {
			setSaveData(null);
		}
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

	if (error) return <div>Gagal memuat data</div>;

	const items = data?.response || [];

	return (
		<div className="profile min-w-full md:flex md:flex-column px-3 md:px-6  justify-content-start gap-0">
			<h1 className="lufga-extrabold text-3xl md:text-5xl mb-3">
				Tema Content
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
									placeholder="Cari nama tema"
									className="w-full"
								/>
							</IconField>
						</form>
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
						<Button
							label="Tambah Tema"
							icon="pi pi-plus"
							onClick={() => {
								setIsModalOpen(true);
								setEditingUser(null); // pastikan tidak ada theme yang dikirim
								setMsg(""); // reset msg
							}}
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
								if (col.field === "name") {
									return (
										<Column
											key={col.field}
											field="name"
											header={col.header}
											body={<Skeleton />}
										/>
									);
								}
								if (col.field === "status") {
									return (
										<Column
											key={col.field}
											header="status"
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
											header="status"
											body={statusBodyTemplate}
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
				<ThemeAdminFormModal
					ref={ModalRef}
					isOpen={isModalOpen}
					saveData={saveData}
					closeModal={() => setIsModalOpen(false)}
					msg={msg}
					theme={editingUser} // null = tambah, ada object = edit
					saveTheme={editingUser ? updateUser : createTheme}
					isNew={!editingUser} // true = tambah, false = edit
				/>
			</div>
		</div>
	);
};

export default ThemeAdminComponnet;
