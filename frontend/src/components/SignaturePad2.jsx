import React, { useRef, useEffect, useState } from "react";
import SignaturePadLibrary from "signature_pad";
import { Button } from "primereact/button";

const SignatureComponent = ({ onSave }) => {
	const canvasRef = useRef(null);
	const [signaturePad, setSignaturePad] = useState(null);

	useEffect(() => {
		if (canvasRef.current) {
			const pad = new SignaturePadLibrary(canvasRef.current);
			setSignaturePad(pad);
		}
	}, []);

	const save = () => {
		if (signaturePad) {
			const dataUrl = signaturePad.toDataURL();
			onSave(dataUrl);
		}
	};

	const clear = () => {
		if (signaturePad) {
			signaturePad.clear();
		}
	};

	return (
		<div className="flex-1  border-round-xl shadow-4 max-h-20rem ">
			<canvas
				ref={canvasRef}
				width={489}
				height={320}
				className="signatureCanvas md:ml-4"
			/>

			<div className="flex md:px-0 px-2 gap-2 md:gap-4 h-3rem py-1 mt-6 md:mt-3">
				<Button
					label="Hapus"
					severity="danger"
					className="flex-1"
					onClick={clear}
					outlined
				/>
				<Button
					label="Gunakan"
					severity="success"
					className="flex-1"
					onClick={save}
					raised
				/>
			</div>
		</div>
	);
};

export default SignatureComponent;
