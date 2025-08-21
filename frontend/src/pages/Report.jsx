import React, { useEffect } from "react";
import Layout from "./Layout.jsx";
import ReportComponent from "../components/Report/ReportComponent.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice.jsx";

const Report = () => {
	const dispatch = useDispatch();
	const { isError, user, isLoading } = useSelector((state) => state.auth);
	const navigate = useNavigate();
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
					<ReportComponent />
				</Layout>
			)}
		</>
	);
};

export default Report;
