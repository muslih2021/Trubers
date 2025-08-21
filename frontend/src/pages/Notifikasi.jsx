import React, { useEffect } from "react";
import Layout from "./Layout.jsx";
import Notifikasi from "../components/Notifikasi/Notifikasicomponent.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice.jsx";

const Users = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isError, user } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(getMe());
	}, [dispatch]);

	useEffect(() => {
		if (isError) {
			navigate("/");
		}
		if (user && user.role !== "admin") {
			navigate("/notifikasi");
		}
	}, [isError, user, navigate]);

	return (
		<>
			{user && (
				<Layout>
					<Notifikasi />
				</Layout>
			)}
		</>
	);
};

export default Users;
