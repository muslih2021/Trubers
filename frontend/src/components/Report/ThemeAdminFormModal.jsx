import React, {
	useState,
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import { Dialog } from "primereact/dialog";
import { Messages } from "primereact/messages";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const ThemeAdminFormModal = forwardRef(
	({ isOpen, closeModal, saveTheme, theme, msg, isNew, saveData }, ref) => {
		const [formData, setFormData] = useState({ name: "", status: "aktif" });
		const msgs = useRef(null);

		// Expose method untuk menampilkan pesan dari luar
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

		// Set form data saat modal edit dibuka
		useEffect(() => {
			if (!isNew && isOpen && theme) {
				setFormData({
					id: theme.data.id,
					name: theme.data.name,
					status: theme.data.status,
				});
			}
		}, [isNew, isOpen, theme]);

		// Menampilkan error dari props
		useEffect(() => {
			if (msg && msgs.current) {
				msgs.current.show([
					{
						severity: "error",
						summary: "Error",
						detail: msg,
						sticky: true,
					},
				]);
			}
		}, [msg]);

		// Reset form saat modal ditutup
		useEffect(() => {
			if (!isOpen) {
				setFormData({ name: "", status: "aktif" });
			}
		}, [isOpen]);

		const handleChange = (e) => {
			setFormData({ ...formData, [e.target.name]: e.target.value });
		};

		const handleSubmit = (e) => {
			e.preventDefault();
			saveTheme({
				id: formData.id,
				name: formData.name,
				status: formData.status,
			});
		};

		const statusOptions = [
			{ label: "Aktif", value: "aktif" },
			{ label: "Tidak Aktif", value: "tidak aktif" },
		];

		if (!isOpen) return null;

		return (
			<Dialog
				breakpoints={{ "960px": "75vw", "641px": "100vw" }}
				header={isNew ? "Tambah Tema" : "Edit Tema"}
				visible={isOpen}
				style={{ width: "40vw" }}
				onHide={closeModal}
			>
				<Messages ref={msgs} />
				<form onSubmit={handleSubmit}>
					<FloatLabel className="my-5 w-12">
						<InputText
							name="name"
							id="name"
							required
							value={formData.name}
							onChange={handleChange}
							className="w-full"
						/>
						<label htmlFor="name">Nama Tema</label>
					</FloatLabel>

					<FloatLabel className="my-5 w-12">
						<Dropdown
							name="status"
							id="status"
							value={formData.status}
							options={statusOptions}
							onChange={handleChange}
							className="w-full"
						/>
						<label htmlFor="status">Status</label>
					</FloatLabel>

					<div className="w-12 flex justify-content-center md:justify-content-end">
						<Button
							disabled={saveData !== null}
							label={saveData !== null ? "" : isNew ? "Tambah" : "Update"}
							icon={saveData === null ? "" : "pi pi-spin pi-spinner"}
							type="submit"
							className="mt-1 gradient-button w-12"
						/>
					</div>
				</form>
			</Dialog>
		);
	}
);

export default ThemeAdminFormModal;
