import React, {
	useState,
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import { Dialog } from "primereact/dialog";
import { Messages } from "primereact/messages";
import { InputNumber } from "primereact/inputnumber"; // 🔹 pakai Number input
import { Button } from "primereact/button";

const ReportAdminFormModal = forwardRef(
	({ isOpen, closeModal, saveUser, user, msg, isNew, saveData }, ref) => {
		const [formData, setFormData] = useState({ score: null });
		const msgs = useRef(null);

		// Expose method untuk menampilkan pesan dari luar komponen
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

		useEffect(() => {
			if (!isNew && isOpen && user) {
				setFormData({ score: user.score, uuid: user.uuid });
			}
		}, [isNew, isOpen, user]);

		// Menampilkan pesan error dari props
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
				setFormData({ score: null });
			}
		}, [isOpen]);

		// Handle perubahan input number
		const handleChange = (e) => {
			setFormData({ ...formData, score: e.value });
		};

		// Handle submit form
		const handleSubmit = (e) => {
			e.preventDefault();
			saveUser({
				uuid: formData.uuid,
				score: formData.score,
			});
		};

		if (!isOpen) return null;

		return (
			<Dialog
				breakpoints={{ "960px": "75vw", "641px": "100vw" }}
				header={isNew ? "Tambah Score" : "Edit Score"}
				visible={isOpen}
				style={{ width: "30vw" }}
				onHide={closeModal}
			>
				<Messages ref={msgs} />

				<form onSubmit={handleSubmit}>
					<div className="field mb-4">
						<label htmlFor="score" className="block mb-2">
							Score
						</label>
						<InputNumber
							id="score"
							value={formData.score}
							onValueChange={handleChange}
							required
							className="w-full"
							min={0}
							max={100}
						/>
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

export default ReportAdminFormModal;
