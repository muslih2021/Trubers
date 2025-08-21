import React, { useEffect } from "react";
import Login from "../components/Auth/Login.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice.jsx";

const Users = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isError, user, message } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(getMe());
	}, [dispatch]);

	useEffect(() => {
		if (user) {
			sessionStorage.setItem("toastMessage", message || "Login berhasil");
			sessionStorage.setItem("toastSeverity", "success");
			sessionStorage.setItem("justLoggedIn", "true");
			navigate("/dashboard");
		}
	}, [user, isError, message, navigate]);

	return <Login />;
};

export default Users;
