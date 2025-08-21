import React, { useEffect } from "react";
import Layout from "./Layout.jsx";
import ReportAdminComponent from "../components/Report/ReportAdminComponent.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice.jsx";

const Report = () => {
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
					<ReportAdminComponent />
				</Layout>
			)}
		</>
	);
};

export default Report;
