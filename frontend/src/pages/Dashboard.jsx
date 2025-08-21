import React, { useEffect } from "react";
import Layout from "./Layout.jsx";
import Welcome from "../components/Welcome.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice.jsx";

const Dashboard = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isError, isLoading, user } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(getMe());
	}, [dispatch]);

	useEffect(() => {
		if (isError) {
			navigate("/");
		}
	}, [isError, navigate]);

	return (
		<>
			{user && (
				<Layout>
					<Welcome />
				</Layout>
			)}
		</>
	);
};

export default Dashboard;
