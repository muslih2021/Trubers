import React, { useEffect } from "react";
import Layout from "./Layout.jsx";
import ThemeAdminComponnet from "../components/Report/ThemeAdminComponnet.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice.jsx";

const ThemeAdmin = () => {
	const dispatch = useDispatch();
	const { isError, user } = useSelector((state) => state.auth);
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getMe());
	}, [dispatch]);

	return (
		<>
			{user && (
				<Layout>
					<ThemeAdminComponnet />
				</Layout>
			)}
		</>
	);
};

export default ThemeAdmin;
