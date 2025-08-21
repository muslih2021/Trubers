import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.jsx";
import { updateReducer } from "../features/authSlice.jsx";
import toastReducer from "../features/toastSlice.jsx";
import dialogSlice from "../features/dialogSlice.jsx";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		update: updateReducer,
		toast: toastReducer,
		dialog:dialogSlice
	},
});
