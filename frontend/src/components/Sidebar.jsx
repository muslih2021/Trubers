import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice.jsx";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Skeleton } from "primereact/skeleton";
import "primeicons/primeicons.css";
import { MdHistory } from "react-icons/md";
import useSWR from "swr";
import axios from "axios";
import { SiSocialblade } from "react-icons/si";
const API_URL = import.meta.env.VITE_API_URL_BACKEND;

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Sidebar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);
	const [small, setSmall] = useState(() => {
		return localStorage.getItem("sidebar-shrink") === "true";
	});

	const toggleSidebar = () => {
		setSmall((prev) => {
			const newValue = !prev;
			localStorage.setItem("sidebar-shrink", newValue);
			return newValue;
		});
	};

	const logout = () => {
		dispatch(LogOut());
		dispatch(reset());
		navigate("/");
	};

	return (
		<aside
			className={`shrink-box ${
				small ? "shrink" : ""
			}  justify-content-between neobackground flex md:flex-column  align-items-center  md:py-4 md:overflow-x-hidden md:h-full border-6 border-round-3xl`}
		>
			<ul className="w-full md:w-10 w-12  md:flex flex-column   align-items-center m-0 p-0  list-none">
				<div className="flex  md:flex-column align-items-left ">
					<NavLink className="md:flex hidden no-underline" to={"/profile"}>
						{user ? (
							<div className="md:w-full flex justify-content-center">
								{user.url_foto_profile ? (
									<div
										style={{
											width: "5.5em",
											height: "5.5em",
											borderRadius: "50%",
											overflow: "hidden",
										}}
									>
										<img
											src={user.url_foto_profile}
											alt="Preview Foto Profile"
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
										/>
									</div>
								) : (
									<Avatar
										shape="circle"
										style={{ width: "5.5em", height: "5.5em" }}
									>
										<i
											className="pi pi-user"
											style={{ color: "#708090", fontSize: "2.5rem" }}
										></i>
									</Avatar>
								)}
							</div>
						) : (
							<div className="md:w-full flex justify-content-center">
								<Skeleton shape="circle" size="5.5rem"></Skeleton>
							</div>
						)}
					</NavLink>
					{user && user.role ? (
						<h2
							className={`shrink-name ${
								small ? "shrink" : ""
							}  text-center mt-3 md:block hidden`}
						>
							<strong>{user && user.name}</strong>
						</h2>
					) : (
						<Skeleton height="1rem" className="mt-3 mb-2"></Skeleton>
					)}
					<div className="text-center mb-5  ">
						{user && user.role ? (
							<Chip
								className="text-xs md:block hidden"
								label={user && user.role}
								style={{ backgroundColor: "#b3e1ffbf", color: "#0077ff" }}
							/>
						) : (
							<Skeleton height="1rem" className="mb-2"></Skeleton>
						)}
					</div>
					<div className={`container  ${small ? "shrink" : ""} `}>
						<ul className="list-none p-0 my-3 md:flex-order-1 flex-order-2">
							<li className="text-center ">
								<NavLink
									className={({ isActive }) =>
										isActive ? "active-link active-menu" : "no-active"
									}
									to={"/dashboard"}
								>
									{" "}
									<i
										className="text-primary pi pi-home"
										style={{ fontSize: "1.2rem" }}
									></i>{" "}
									<span className={`shrink-box ${small ? "shrink" : ""}`}>
										{!small && (
											<span
												className="hidden md:inline"
												style={{ transition: "opacity 0.3s ease-in-out" }}
											>
												Dashboard
											</span>
										)}
									</span>
								</NavLink>
							</li>
						</ul>
						{user && user.role === "admin" && (
							<>
								<ul className="list-none p-0 my-3 md:flex-order-3 flex-order-1">
									<li className="text-center ">
										<NavLink
											className={({ isActive }) =>
												isActive ? "active-link active-menu" : "no-active"
											}
											to={"/users"}
										>
											<i
												className="pi pi-users"
												style={{ fontSize: "1.2rem" }}
											></i>{" "}
											<span className={`shrink-box ${small ? "shrink" : ""}`}>
												{!small && (
													<span
														className="hidden md:inline"
														style={{ transition: "opacity 0.3s ease-in-out" }}
													>
														Users
													</span>
												)}
											</span>
										</NavLink>
									</li>
								</ul>
								<ul className="list-none p-0  my-3  md:flex-order-2 flex-order-4">
									<li className="text-center">
										<NavLink
											className={({ isActive }) =>
												isActive ? "active-link active-menu" : "no-active"
											}
											to={"/content-report-all"}
										>
											<MdHistory
												className="mx-1"
												style={{ fontSize: "1.2rem" }}
											/>
											<span className={`shrink-box ${small ? "shrink" : ""}`}>
												{!small && (
													<span
														className="hidden md:inline"
														style={{ transition: "opacity 0.3s ease-in-out" }}
													>
														Content Report
													</span>
												)}
											</span>
										</NavLink>
									</li>
								</ul>
								<ul className="list-none p-0  my-3  md:flex-order-2 flex-order-4">
									<li className="text-center">
										<NavLink
											className={({ isActive }) =>
												isActive ? "active-link active-menu" : "no-active"
											}
											to={"/theme-all"}
										>
											<SiSocialblade
												className="mx-1 "
												style={{ fontSize: "1.2rem" }}
											/>
											<span className={`shrink-box ${small ? "shrink" : ""}`}>
												{!small && (
													<span
														className="hidden md:inline"
														style={{ transition: "opacity 0.3s ease-in-out" }}
													>
														Theme
													</span>
												)}
											</span>
										</NavLink>
									</li>
								</ul>
							</>
						)}
						{user && user.role === "user" && (
							<>
								<ul className="list-none p-0  my-3  md:flex-order-2 flex-order-1">
									<li className="text-center">
										<NavLink
											className={({ isActive }) =>
												isActive ? "active-link active-menu" : "no-active"
											}
											to={"/content-report"}
										>
											<MdHistory
												className="mx-1"
												style={{ fontSize: "1.2rem" }}
											/>
											<span className={`shrink-box ${small ? "shrink" : ""}`}>
												{!small && (
													<span
														className="hidden md:inline"
														style={{ transition: "opacity 0.3s ease-in-out" }}
													>
														Report
													</span>
												)}
											</span>
										</NavLink>
									</li>
								</ul>
							</>
						)}

						<ul className="list-none p-0 md:hidden flex my-3 md:flex-order-3 flex-order-3">
							<li className="text-center ">
								<NavLink
									className={({ isActive }) =>
										isActive ? "active-link active-menu" : "no-active"
									}
									to={"/profile"}
								>
									<i className="pi pi-user" style={{ fontSize: "1.2rem" }}></i>{" "}
									<span
										className={`shrink-box ${small ? "shrink" : ""}`}
									></span>
								</NavLink>
							</li>
						</ul>
					</div>
				</div>
			</ul>
			<div className=" md:flex-column md:flex hidden align-items-center ">
				<Button
					icon={
						!small
							? "pi pi-arrow-down-left-and-arrow-up-right-to-center"
							: "pi pi-arrow-up-right-and-arrow-down-left-from-center"
					}
					label=""
					className="my-3"
					onClick={toggleSidebar}
					text
					raised
				/>
				<i
					onClick={logout}
					className="text-lightred-color  my-3  pi pi-sign-out"
					style={{ fontSize: "1.3rem" }}
				></i>
			</div>
		</aside>
	);
};

export default Sidebar;
