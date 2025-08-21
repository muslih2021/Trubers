import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
	name: "toast",
	initialState: {
		message: "",
		severity: "",
	},
	reducers: {
		showToast: (state, action) => {
			state.message = action.payload.message;
			state.severity = action.payload.severity;
		},
		clearToast: (state) => {
			state.message = "";
			state.severity = "";
		},
	},
});

export const { showToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
