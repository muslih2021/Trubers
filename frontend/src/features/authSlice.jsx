import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialAuthState = {
	user: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: "",
};

const initialUpdateState = {
	message: "",
	isErrorUpdate: false,
	isSuccessUpdate: false,
	isLoadingUpdate: false,
};
const API_URL = import.meta.env.VITE_API_URL_BACKEND;

export const LoginUser = createAsyncThunk(
	"user/LoginUser",
	async (user, thunkAPI) => {
		try {
			const response = await axios.post(
				`${API_URL}/login`,
				{
					email: user.email,
					password: user.password,
					rememberMe: user.rememberMe, // kalau perlu
				},
				{
					withCredentials: true, // ⬅️ PENTING agar cookie session dikirim & disimpan
				}
			);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.msg || "Login gagal"
			);
		}
	}
);

export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
	try {
		const response = await axios.get(`${API_URL}/me`, {
			withCredentials: true, // ⬅️ WAJIB jika pakai session cookie
		});
		return response.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(
			error.response?.data?.msg || "Gagal mengambil data user"
		);
	}
});

export const updateMe = createAsyncThunk(
	"user/updateMe",
	async (userData, thunkAPI) => {
		try {
			const response = await axios.patch(`${API_URL}/updateMe`, userData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			await thunkAPI.dispatch(getMe());
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.msg || "Gagal memperbarui profil"
			);
		}
	}
);
export const updatePassword = createAsyncThunk(
	"user/updatePassword",
	async (passwordData, thunkAPI) => {
		try {
			const response = await axios.patch(
				`${API_URL}/update-password`,
				passwordData,
				{
					headers: { "Content-Type": "application/json" },
				}
			);
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.msg || "Gagal mengubah password"
			);
		}
	}
);

export const LogOut = createAsyncThunk("user/LogOut", async () => {
	await axios.delete(`${API_URL}/logout`);
});

export const authSlice = createSlice({
	name: "auth",
	initialState: initialAuthState,
	reducers: {
		reset: () => initialAuthState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(LoginUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(LoginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
				state.message = action.payload.msg;
			})
			.addCase(LoginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
			.addCase(getMe.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getMe.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
			})
			.addCase(getMe.rejected, (state) => {
				state.isLoading = false;
				state.isError = true;
				state.user = null;
			})
			.addCase(LogOut.fulfilled, () => initialAuthState);
	},
});

export const updateSlice = createSlice({
	name: "update",
	initialState: initialUpdateState,
	reducers: {
		resetUpdateStatus: () => initialUpdateState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(updateMe.pending, (state) => {
				state.isLoadingUpdate = true;
			})
			.addCase(updateMe.fulfilled, (state, action) => {
				state.isLoadingUpdate = false;
				state.isSuccessUpdate = true;
				state.message = action.payload.msg;
			})
			.addCase(updateMe.rejected, (state, action) => {
				state.isLoadingUpdate = false;
				state.isErrorUpdate = true;
				state.message = action.payload;
			})
			.addCase(updatePassword.pending, (state) => {
				state.isLoadingUpdate = true;
			})
			.addCase(updatePassword.fulfilled, (state, action) => {
				state.isLoadingUpdate = false;
				state.isSuccessUpdate = true;
				state.message = action.payload.msg;
			})
			.addCase(updatePassword.rejected, (state, action) => {
				state.isLoadingUpdate = false;
				state.isErrorUpdate = true;
				state.message = action.payload;
			})
			.addCase(LogOut.fulfilled, () => initialUpdateState);
	},
});

export const { reset } = authSlice.actions;
export const { resetUpdateStatus } = updateSlice.actions;

export default authSlice.reducer;
export const updateReducer = updateSlice.reducer;
