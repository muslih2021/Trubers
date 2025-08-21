import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	visible: false,
	severity: "info",
	message: "",
};

const dialogSlice = createSlice({
	name: "dialog",
	initialState,
	reducers: {
		showDialog: (state, action) => {
			state.visible = true;
			state.severity = action.payload.severity;
			state.message = action.payload.message;
		},
		hideDialog: (state) => {
			state.visible = false;
			state.message = "";
		},
	},
});

export const { showDialog, hideDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
