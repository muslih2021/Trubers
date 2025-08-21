import React, {
	useState,
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const ReportFormModal = forwardRef(
	(
		{ isOpen, closeModal, saveUser, user, msg, isNew, saveData, themes },
		ref
	) => {
		const [formData, setFormData] = useState({
			url_postingan: "",
			themeId: undefined,
		});
		const toast = useRef(null);

		// Expose method untuk menampilkan toast dari luar
		useImperativeHandle(ref, () => ({
			showMessage(content, severity = "error") {
				toast.current.show({
					severity,
					summary: severity === "error" ? "Error" : "Info",
					detail: content,
					life: 3000,
					key: Date.now(), // key unik supaya bisa muncul berkali-kali
				});
			},
		}));

		// Set form saat modal dibuka / edit
		useEffect(() => {
			if (!isNew && isOpen && user) {
				setFormData({
					url_postingan: user.url_postingan || "",
					uuid: user.uuid,
					themeId: user.themeId ?? undefined,
				});
			} else if (isNew && isOpen) {
				setFormData({ url_postingan: "", themeId: undefined });
			}
		}, [isNew, isOpen, user]);

		// Tampilkan pesan backend setiap kali modal dibuka, pesan sama pun muncul
		useEffect(() => {
			if (msg && isOpen && toast.current) {
				toast.current.show({
					severity: "error",
					summary: "Error",
					detail: msg,
					life: 3000,
					key: Date.now(), // unik supaya selalu muncul
				});
			}
		}, [msg, isOpen]);

		// Reset form saat modal ditutup
		useEffect(() => {
			if (!isOpen) {
				setFormData({ url_postingan: "", themeId: undefined });
			}
		}, [isOpen]);

		const handleChange = (e) => {
			setFormData({ ...formData, [e.target.name]: e.target.value });
		};

		const handleSubmit = (e) => {
			e.preventDefault();

			// Validasi frontend
			if (!formData.themeId) {
				toast.current.show({
					severity: "error",
					summary: "Error",
					detail: "Tema postingan harus dipilih.",
					life: 3000,
					key: Date.now(),
				});
				return;
			}
			if (!formData.url_postingan.trim()) {
				toast.current.show({
					severity: "error",
					summary: "Error",
					detail: "URL Postingan tidak boleh kosong.",
					life: 3000,
					key: Date.now(),
				});
				return;
			}

			// Submit data
			saveUser({
				uuid: formData.uuid,
				url_postingan: formData.url_postingan,
				themeId: formData.themeId,
			});
		};

		if (!isOpen) return null;

		return (
			<Dialog
				breakpoints={{ "960px": "75vw", "641px": "100vw" }}
				header={isNew ? "Tambah URL Postingan" : "Edit URL Postingan"}
				visible={isOpen}
				style={{ width: "40vw" }}
				onHide={closeModal}
			>
				<Toast ref={toast} />

				<form onSubmit={handleSubmit}>
					<div className="field">
						<FloatLabel className="my-5 w-12">
							<Dropdown
								value={formData.themeId}
								options={themes?.response || []}
								optionLabel="name"
								optionValue="id"
								onChange={(e) => setFormData({ ...formData, themeId: e.value })}
								placeholder="Pilih Tema Postingan"
								className="w-full"
							/>
							<label htmlFor="theme">Pilih Tema Postingan</label>
						</FloatLabel>
					</div>

					<div className="field">
						<FloatLabel className="my-5 w-12">
							<InputText
								name="url_postingan"
								id="url_postingan"
								value={formData.url_postingan}
								onChange={handleChange}
								className="w-full"
							/>
							<label htmlFor="url_postingan">URL Postingan</label>
						</FloatLabel>
					</div>

					<div className="w-12 flex justify-content-center md:justify-content-end">
						<Button
							disabled={saveData !== null}
							label={saveData !== null ? "" : isNew ? "Tambah" : "Update"}
							icon={saveData === null ? "" : "pi pi-spin pi-spinner-dotted"}
							type="submit"
							className="mt-1 gradient-button w-12"
						/>
					</div>
				</form>
			</Dialog>
		);
	}
);

export default ReportFormModal;
