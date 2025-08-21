import React from "react";
import { Chip } from "primereact/chip";
import "primeicons/primeicons.css";

const getStatusProps = (status) => {
	switch (status) {
		case "dinilai":
			return {
				label: "Dinilai",
				icon: "pi pi-check-circle",
				bgColor: "#dcfce7",
				textColor: "#16a34a",
			};
		case "belum":
			return {
				label: "Belum Dinilai",
				icon: "pi pi-clock",
				bgColor: "#fef9c3",
				textColor: "#d97706",
			};
		default:
			return {
				label: status,
				icon: "pi pi-question-circle",
				bgColor: "#e5e7eb",
				textColor: "#374151",
			};
	}
};

const StatusChip = ({ status }) => {
	const { label, icon, bgColor, textColor } = getStatusProps(status);

	return (
		<span style={{ display: "inline-block" }}>
			<Chip
				label={label}
				icon={icon}
				style={{
					display: "inline-flex",
					alignItems: "center",
					backgroundColor: bgColor,
					color: textColor,
					padding: "0rem 0.5rem",
					fontWeight: 500,
					fontSize: "0.6rem",
					borderRadius: "0.3rem",
					whiteSpace: "nowrap",
				}}
				pt={{
					icon: {
						style: {
							fontSize: "0.75rem",
						},
					},
				}}
			/>
		</span>
	);
};

export default StatusChip;
