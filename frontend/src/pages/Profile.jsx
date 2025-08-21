import React, { useEffect } from "react";
import Layout from "./Layout";
import Profilecomponent from "../components/Profilecomponent.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../features/authSlice.jsx";
import { useNavigate } from "react-router-dom";

const Profile = () => {
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
					<Profilecomponent />
				</Layout>
			)}
		</>
	);
};

export default Profile;
