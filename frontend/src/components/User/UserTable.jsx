import React, { useState, useEffect, useRef } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip";

const UserTable = ({
	users,
	openEditModal,
	deleteUser,
	sendVerificationEmail,
	role,
	setRole,
	roles,
	status,
	isVerified,
	setIsVerified,
	selectedUsers,
	setSelectedUsers,
	processingData,
	sortField,
	sortOrder,
	onSort,
	selectedKeys2,
	export2,
	setExport2,
	loading,
}) => {
	const dt = useRef(null);

	const statusBodyTemplate = (rowData) => {
		return (
			<div className="flex justify-content-center">
				<Tag
					value={rowData.isVerified ? "Verified" : "Not Verified"}
					severity={rowData.isVerified ? "success" : "danger"}
					rounded
				/>
			</div>
		);
	};

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
				{rowData.isVerified && (
					<Button
						icon={
							processingData === rowData.email
								? "pi pi-spin pi-spinner"
								: "pi pi-send"
						}
						className="p-button-text"
						style={{
							padding: 0,
							margin: 0,
							width: "auto",
						}}
						disabled={processingData === rowData.email}
						onClick={(e) => {
							e.stopPropagation();
							sendVerificationEmail(rowData.email);
						}}
					/>
				)}
			</div>
		);
	};
	const roleFilterHeader = (
		<div className="flex align-items-center ">
			<p className={`m-0 role-text ${role ? "active-role" : ""}`}>Role</p>
			<Dropdown
				id="role"
				value={role}
				options={roles}
				onChange={(e) => setRole(e.value)}
				placeholder=" "
				optionLabel="label"
				optionValue="value"
				valueTemplate={() => (
					<i
						className={`pi pi-filter ${role ? "active-filter" : ""}`}
						style={{ fontSize: "1rem" }}
					/>
				)}
				className="dropdown-icon-only custom-clear-right"
			/>
		</div>
	);
	const isVerifiedFilterHeader = (
		<div className="flex align-items-center ">
			<p className={`m-0 role-text ${isVerified ? "active-role" : ""}`}>
				Status
			</p>
			<Dropdown
				id="isVerified"
				value={isVerified}
				options={status}
				onChange={(e) => setIsVerified(e.value)}
				placeholder=" "
				optionLabel="label"
				optionValue="value"
				valueTemplate={() => (
					<i
						className={`pi pi-filter ${isVerified ? "active-filter" : ""}`}
						style={{ fontSize: "1rem" }}
					/>
				)}
				className="dropdown-icon-only custom-clear-right"
			/>
		</div>
	);
	const items = Array.from({ length: 5 }, (v, i) => i);

	const columns = [
		{ key: "id", field: "id", header: "ID", sortable: true },
		{ key: "name", field: "name", header: "Nama", sortable: true },
		{ key: "email", field: "email", header: "Email", sortable: true },
		{
			key: "linkmedsos",
			field: "linkmedsos",
			header: "linkmedsos",
			sortable: true,
		},
		{
			key: "sosmed_utama",
			field: "sosmed_utama",
			header: "Sosmed Utama",
			sortable: true,
		},
		{
			key: "nama_akun",
			field: "nama_akun",
			header: "Nama Akun",
			sortable: true,
		},
		{
			key: "jumlah_follower_terakhir",
			field: "jumlah_follower_terakhir",
			header: "Jumlah Follower",
			sortable: true,
		},
		{
			key: "interest_minat",
			field: "interest_minat",
			header: "Interest / Minat",
			sortable: true,
		},
		{ key: "kota", field: "kota", header: "Kota", sortable: true },
		{ key: "sekolah", field: "sekolah", header: "Sekolah", sortable: true },
		{ key: "kelas", field: "kelas", header: "Kelas", sortable: true },
		{ key: "role", field: "role" },
		{
			key: "isVerified",
			field: "isVerified",
		},
		{
			key: "createdAt",
			field: "createdAt",
			header: "Created At",
			sortable: true,
			body: (rowData) => formatDate(rowData.createdAt),
		},
		{
			key: "updatedAt",
			field: "updatedAt",
			header: "Updated At",
			sortable: true,
			body: (rowData) => formatDate(rowData.updatedAt),
		},
		{ key: "actions", header: "Actions", body: actionBodyTemplate },
	];

	const [visibleColumns, setVisibleColumns] = useState(
		columns.filter((col) => selectedKeys2.includes(col.key))
	);
	useEffect(() => {
		const newVisibleColumns = columns.filter((col) =>
			selectedKeys2.includes(col.key)
		);
		setVisibleColumns(newVisibleColumns);
	}, [selectedKeys2]);

	const handleSort = (e) => {
		if (onSort) {
			onSort({
				sortField: e.sortField,
				sortOrder: e.sortOrder,
			});
		}
	};
	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		return date.toLocaleString("id-ID", {
			day: "2-digit",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};
	const exportExcel = () => {
		import("xlsx").then((xlsx) => {
			const selectedColumns = columns.filter((col) =>
				selectedKeys2.includes(col.key)
			);
			const filteredUsers = users.map((user) => {
				const filteredUser = {};
				selectedColumns.forEach((col) => {
					if (col.key === "linkmedsos") {
						filteredUser["linkmedsos"] = user.linkmedsos;
					} else if (col.field) {
						filteredUser[col.field] =
							user[col.field] !== undefined ? user[col.field] : null;
					}
				});
				return filteredUser;
			});
			const worksheet = xlsx.utils.json_to_sheet(filteredUsers);
			const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
			const excelBuffer = xlsx.write(workbook, {
				bookType: "xlsx",
				type: "array",
			});
			saveAsExcelFile(excelBuffer, "Data");
		});
	};
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
	useEffect(() => {
		if (export2 === true) {
			exportExcel();
			setExport2(false);
		}
	}, [export2]);

	return (
		<div className="my-4 w-12">
			{!users ? (
				<Skeleton width="100%" height="10rem" />
			) : users.length === 0 ? (
				<DataTable
					value={users.map((user) => ({
						...user,
					}))}
					tableStyle={{ minWidth: "50rem" }}
				>
					{visibleColumns.map((col, index) => {
						if (col.field === "isVerified") {
							return (
								<Column
									key={col.field || `col-${index}`}
									header={isVerifiedFilterHeader}
									body={statusBodyTemplate}
								/>
							);
						}
						if (col.field === "role") {
							return (
								<Column
									key={col.field || `col-${index}`}
									field={col.field}
									header={roleFilterHeader}
									body={col.body}
								/>
							);
						}
						return (
							<Column
								key={col.field || `col-${index}`}
								field={col.field}
								header={col.header}
								body={col.body}
								sortable={col.sortable}
							/>
						);
					})}
				</DataTable>
			) : (
				<DataTable
					removableSort
					value={users.map((user) => ({
						...user,
					}))}
					resizableColumns
					showGridlines
					selection={selectedUsers}
					onSelectionChange={(e) => setSelectedUsers(e.value)}
					dataKey="uuid"
					selectionMode="checkbox"
					tableStyle={{ minWidth: "50rem" }}
					lazy
					loading={!users}
					sortField={sortField}
					sortOrder={sortOrder === "ASC" ? 1 : sortOrder === "DESC" ? -1 : null}
					onSort={handleSort}
					ref={dt}
				>
					<Column
						selectionMode="multiple"
						headerStyle={{ width: "3rem" }}
					></Column>
					{visibleColumns.map((col, index) => {
						if (col.field === "isVerified") {
							return (
								<Column
									key={col.field || `col-${index}`}
									header={isVerifiedFilterHeader}
									body={statusBodyTemplate}
								/>
							);
						}
						if (col.field === "role") {
							return (
								<Column
									key={col.field || `col-${index}`}
									field={col.field}
									header={roleFilterHeader}
									body={col.body}
								/>
							);
						}
						return (
							<Column
								key={col.field || `col-${index}`}
								field={col.field}
								header={col.header}
								body={col.body}
								sortable={col.sortable}
							/>
						);
					})}
				</DataTable>
			)}
		</div>
	);
};

export default UserTable;
