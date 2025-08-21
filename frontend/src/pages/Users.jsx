import React, { useEffect } from "react";
import Layout from "./Layout";
import UserList from "../components/User/UserList.jsx";
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
			return;
		}

		if (user?.role && user.role !== "admin") {
			navigate("/dashboard");
		}
	}, [isError, user, navigate]);

	return (
		<>
			{user && (
				<Layout>
					<UserList />
				</Layout>
			)}
		</>
	);
};

export default Users;
