import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import UserTable from "./UserTable";
import useSWR from "swr";
import UserModal from "./UserModal";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Paginator } from "primereact/paginator";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";

const API_URL = import.meta.env.VITE_API_URL_BACKEND;
const fetcher = async (url) => {
	const response = await axios.get(url);
	return response.data;
};

const UserList = () => {
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

	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(6);
	const [pages, setPages] = useState(0);
	const [rows, setRows] = useState(0);
	const [query, setQuery] = useState("");
	const [role, setRole] = useState(null);
	const [roles] = useState([
		{ label: "Semua", value: "" },
		{ label: "admin", value: "admin" },
		{ label: "User", value: "user" },
	]);
	const [isVerified, setIsVerified] = useState(null);
	const [status] = useState([
		{ label: "Semua", value: "" },
		{ label: "Verified", value: 1 },
		{ label: "Not Verified", value: 0 },
	]);
	const [selectedUsers, setSelectedUsers] = useState([]);

	const {
		data: users,
		error,
		mutate,
	} = useSWR(
		`${API_URL}/users?search_query=${keyword}&page=${page}&limit=${limit}&role=${
			role || ""
		}&isVerified=${isVerified ?? ""}&sort=${sortField}&order=${sortOrder}`,
		fetcher
	);
	const [processingData, setProcessingData] = useState(null);
	const [saveData, setSaveData] = useState(null);

	useEffect(() => {
		if (users) {
			setPages(users.totalPage);
			setRows(users.totalRows);
		}
	}, [users]);
	const onPageChange = (event) => {
		setPage(event.page);
		setLimit(event.rows);
	};

	const [editingUser, setEditingUser] = useState(null);
	const [showUser, setShowUser] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isShowModalOpen, setIsShowModalOpen] = useState(false);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [newUser, setNewUser] = useState({
		name: "",
		email: "",
		linkmedsos: "",
		password: "",
		role: "user",
		isVerified: false,

		// kolom tambahan
		sosmed_utama: "", // "Instagram" atau "TikTok"
		nama_akun: "", // misal @username
		jumlah_follower_terakhir: 0, // default angka
		interest_minat: "", // minat user
		kota: "", // asal kota
		sekolah: "", // nama sekolah
		kelas: "", // kelas (misal 10 / 11)
	});

	const [msg, setMsg] = useState("");
	const toast = useRef(null);
	const ModalRef = useRef(null);

	// if (error) {
	//   console.error("Error fetching users:", error);
	//   return <p style={{ color: "red" }}>Error loading users</p>;
	// }
	// if (!users) return <p>Loading...</p>;

	const sendVerificationEmail = async (email) => {
		try {
			setProcessingData(email);
			await axios.post(`${API_URL}/api/send-email`, {
				email: email,
				message:
					"Email Anda telah diverifikasi. Anda bisa menggunakannya untuk login.",
			});
			toast.current.show({
				severity: "success",
				summary: "Terkirim",
				detail: `Email verifikasi telah dikirim ke ${email}`,
				life: 3000,
			});
		} catch (error) {
			console.error("Error sending email:", error);
			toast.current.show({
				severity: "error",
				summary: "Gagal",
				detail: `Gagal mengirim email ke ${email}`,
				life: 3000,
			});
		} finally {
			setProcessingData(null);
		}
	};

	const openEditModal = async (id) => {
		try {
			const response = await axios.get(`${API_URL}/users/${id}`);
			setEditingUser({ ...response.data, password: "", confPassword: "" });
			setIsModalOpen(true);
		} catch (error) {
			console.error("Error fetching user details:", error);
		}
	};

	const openShowModal = async (id) => {
		try {
			const response = await axios.get(`${API_URL}/users/${id}`);
			setShowUser({ ...response.data, password: "", confPassword: "" });
			setIsShowModalOpen(true);
		} catch (error) {
			console.error("Error fetching user details:", error);
		}
	};

	const updateUser = async (userData) => {
		try {
			setSaveData(userData);
			await axios.patch(`${API_URL}/users/${userData.get("uuid")}`, userData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setIsModalOpen(false);
			toast.current.show({
				severity: "success",
				summary: "Update",
				detail: "User has been updated",
				life: 3000,
			});
			mutate();
		} catch (error) {
			if (error.response) {
				const errorMsg = error.response.data.msg;
				setMsg(errorMsg);
			}
		} finally {
			setSaveData(null);
		}
	};

	const addUser = async (userData) => {
		try {
			setSaveData(userData);
			await axios.post(`${API_URL}/users`, userData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setIsAddModalOpen(false);
			toast.current.show({
				severity: "success",
				summary: "Deleted",
				detail: "User has been add",
				life: 3000,
			});
			mutate();
		} catch (error) {
			if (error.response) {
				const errorMsg = error.response.data.msg;
				setMsg(errorMsg);
			}
		} finally {
			setSaveData(null);
		}
	};

	const AcceptUser = async (userData) => {
		try {
			await axios.patch(`${API_URL}/users/${userData.uuid}`, userData);
			setIsShowModalOpen(false);
			mutate();
		} catch (error) {
			if (error.response) {
				setMsg(error.response.data.msg);
			}
		}
	};

	const deleteUser = async (userId) => {
		confirmDialog({
			message: "Do you want to delete this record?",
			header: "Delete Confirmation",
			icon: "pi pi-info-circle",
			defaultFocus: "reject",
			acceptClassName: "p-button-danger",
			accept: async () => {
				try {
					setProcessingData(userId);
					await axios.delete(`${API_URL}/users/${userId}`);
					toast.current.show({
						severity: "success",
						summary: "Deleted",
						detail: "User has been deleted",
						life: 3000,
					});
					mutate();
				} catch (error) {
					console.error("Error deleting user:", error);
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
				toast.current.show({
					severity: "warn",
					summary: "Cancelled",
					detail: "You have cancelled",
					life: 3000,
				});
			},
		});
	};

	const searchData = (e) => {
		e.preventDefault();
		setPage(0);
		setKeyword(query);
	};

	const deleteManyUsers = () => {
		if (selectedUsers.length === 0) return;

		confirmDialog({
			message: `Yakin ingin menghapus ${selectedUsers.length} user?`,
			header: "Konfirmasi Hapus Massal",
			icon: "pi pi-info-circle",
			acceptClassName: "p-button-danger",
			accept: async () => {
				try {
					const ids = selectedUsers.map((u) => u.uuid);
					await axios.post(`${API_URL}/users/delete-many`, { ids });
					toast.current.show({
						severity: "success",
						summary: "Sukses",
						detail: "Data berhasil dihapus",
						life: 3000,
					});
					mutate();
					setSelectedUsers([]);
				} catch (err) {
					toast.current.show({
						severity: "error",
						summary: "Error",
						detail: "Gagal menghapus data",
						life: 3000,
					});
				}
			},
		});
	};

	const updateManyStatus = async (newStatus) => {
		if (selectedUsers.length === 0) return;
		try {
			const ids = selectedUsers.map((u) => u.uuid);
			await axios.post(`${API_URL}/users/update-status-many`, {
				ids,
				isVerified: newStatus,
			});
			toast.current.show({
				severity: "success",
				summary: "Status Diperbarui",
				detail: "Berhasil update status",
				life: 3000,
			});
			mutate();
			setSelectedUsers([]);
		} catch (err) {
			toast.current.show({
				severity: "error",
				summary: "Error",
				detail: "Gagal update status",
				life: 3000,
			});
		}
	};

	const [selectedKeys2, setSelectedKeys2] = useState([
		"sosmed_utama",
		"nama_akun",
		"jumlah_follower_terakhir",
		"interest_minat",
		"kota",
		"sekolah",
		"kelas",
		"linkmedsos",
		"name",
		"email",
		"role",
		"isVerified",
		"actions",
	]);
	const columns = [
		{ key: "id" },
		{ key: "name" },
		{ key: "email" },
		{ key: "sosmed_utama" },
		{ key: "nama_akun" },
		{ key: "jumlah_follower_terakhir" },
		{ key: "interest_minat" },
		{ key: "kota" },
		{ key: "sekolah" },
		{ key: "kelas" },
		{ key: "linkmedsos" },
		{ key: "role" },
		{ key: "isVerified" },
		{ key: "createdAt" },
		{ key: "updatedAt" },
		{ key: "actions" },
	];
	const onColumnToggle2 = (e) => {
		setSelectedKeys2(e.value);
		console.log(e.value);
	};
	const [export2, setExport2] = useState(false);

	return (
		<div className="profile min-w-full md:flex md:flex-column px-3 md:px-6  justify-content-start gap-0">
			<Toast ref={toast} />
			<ConfirmDialog />
			<h1 className="lufga-extrabold md:text-5xl text-title text-3xl">
				Data Users
			</h1>
			<div className="border-round-xl md:my-4 mb-8 gradient-border md:-mt-3 py-3 px-3 md:px-6 md:py-2 md:pl-4 shadow-4 w-full">
				<div className="flex flex-wrap md:flex-nowrap my-2 md:justify-content-between justify-content-center align-items-center">
					<div className="flex w-12 my-2  gap-3">
						<MultiSelect
							value={selectedKeys2}
							options={columns}
							optionLabel="key"
							optionValue="key"
							onChange={onColumnToggle2}
							dropdownIcon={
								<i
									className="pi pi-objects-column"
									style={{ fontSize: "2rem" }}
								/>
							}
						/>
						<i
							className="pi pi-file-export p-2"
							style={{ cursor: "pointer", fontSize: "2rem", color: "#708090" }}
							onClick={() => setExport2(true)}
						/>
						<Button
							label="Tambah Data"
							onClick={() => setIsAddModalOpen(true)}
							className=" lufga-semi-bold fadeindown animation-duration-1000 gradient-button w-12 md:w-3"
						/>
					</div>

					<form onSubmit={searchData} className=" md:my-0 my-2">
						<IconField iconPosition="left">
							<InputIcon className="pi pi-search"> </InputIcon>
							<InputText
								type="text"
								className="input"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search"
							/>
						</IconField>
						<button cl className="hidden" type="submit">
							hh
						</button>
					</form>
				</div>

				<div className="flex w-12 align-items-center">
					{selectedUsers.length > 0 && (
						<div className="my-2 flex flex-column gap-4 p-3">
							<i
								style={{
									color: "var(--red-600)",
									cursor: "pointer",
									fontSize: "1.4rem",
								}}
								className="pi pi-trash "
								onClick={deleteManyUsers}
							/>

							<i
								className="pi pi-file-check"
								style={{
									color: "var(--primary-400)",
									cursor: "pointer",
									fontSize: "1.4rem",
								}}
								onClick={() => updateManyStatus(1)}
							/>
							<i
								className="pi pi-file-excel"
								style={{
									color: "var(--blue-300)",
									cursor: "pointer",
									fontSize: "1.4rem",
								}}
								onClick={() => updateManyStatus(0)}
							/>
						</div>
					)}
					<UserTable
						users={users?.response || []}
						openShowModal={openShowModal}
						openEditModal={openEditModal}
						deleteUser={deleteUser}
						sendVerificationEmail={sendVerificationEmail}
						role={role}
						setRole={setRole}
						roles={roles}
						isVerified={isVerified}
						setIsVerified={setIsVerified}
						status={status}
						selectedUsers={selectedUsers}
						setSelectedUsers={setSelectedUsers}
						processingData={processingData}
						onSort={handleSortChange}
						sortField={sortField}
						sortOrder={sortOrder}
						selectedKeys2={selectedKeys2}
						export2={export2}
						setExport2={setExport2}
					></UserTable>
				</div>

				<div className="md:flex my-2 justify-content-between align-items-center">
					<p
						style={{ color: "var(--surface-400)" }}
						className="lufga text-xs text-justify md:text-sm   md:text-left"
					>
						Total Data: {rows} | Halaman: {rows ? page + 1 : 0} dari {pages}
					</p>
					<Paginator
						className="p-0 m-0"
						first={page * limit}
						rows={limit}
						totalRecords={rows}
						rowsPerPageOptions={[1, 6, 12, 20, 30, 80, 100]}
						onPageChange={onPageChange}
					/>
				</div>
			</div>

			<UserModal
				ref={ModalRef}
				isOpen={isModalOpen}
				saveData={saveData}
				closeModal={() => setIsModalOpen(false)}
				user={editingUser}
				saveUser={updateUser}
				msg={msg}
			/>
			<UserModal
				ref={ModalRef}
				isOpen={isShowModalOpen}
				closeModal={() => setIsShowModalOpen(false)}
				user={showUser}
				saveUser={AcceptUser}
				msg={msg}
				isShow
			/>
			<UserModal
				ref={ModalRef}
				isOpen={isAddModalOpen}
				saveData={saveData}
				closeModal={() => setIsAddModalOpen(false)}
				user={newUser}
				saveUser={addUser}
				msg={msg}
				isNew
			/>
		</div>
	);
};

export default UserList;
