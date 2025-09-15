import Navbar from "../../components/guest/Navbar.jsx";
import React, { useState, useRef } from "react";
import useSWR from "swr";
import { Dropdown } from "primereact/dropdown";
import "primeflex/primeflex.css";
import profilePict from "../../assets/images/profile-picture.png";
import UserModal from "./UserModal";
import { Paginator } from "primereact/paginator";
const API_URL = import.meta.env.VITE_API_URL_BACKEND;

// fetcher SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

// fallback helper
const safeNumber = (value) => (value != null ? value : 0);

const Leaderboard = () => {
	const [activeButton, setActiveButton] = useState("Account");
	const [orderBy, setOrderBy] = useState("total");
	// di dalam Leaderboard
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 1; // jumlah row per halaman

	// URL utama leaderboard
	const url =
		activeButton === "Account"
			? `${API_URL}/ContentReportByUserRank?orderBy=${orderBy}`
			: `${API_URL}/ContentReportByPostRank?orderBy=${orderBy}`;

	const { data, error, isLoading } = useSWR(url, fetcher);
	// state untuk modal dan uuid
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUuid, setSelectedUuid] = useState(null);

	// SWR untuk detail user (otomatis fetch saat ada uuid)
	const {
		data: userDetail,
		error: userError,
		isLoading: isUserLoading,
	} = useSWR(
		selectedUuid ? `${API_URL}/ContentReportPerforma/${selectedUuid}` : null,
		fetcher
	);

	// buka modal
	const openEditModal = (uuid) => {
		setSelectedUuid(uuid); // set UUID dulu → trigger SWR
		setIsModalOpen(true); // buka modal
	};

	if (isLoading)
		return (
			<div className="containerloading">
				<div className="donut"></div>
			</div>
		);
	if (error) return <p>Error: {error.message}</p>;

	// mapping data leaderboard
	const mappedData =
		data?.map((item) => {
			if (activeButton === "Account") {
				return {
					id: item.id,
					uuid: item.uuid, // ⬅️ jangan lupa uuid!
					name: item.name,
					username: item.nama_akun || "-",
					avatar: item.url_foto_profile || profilePict,
					like: safeNumber(item.totalLikes),
					comment: safeNumber(item.totalComments),
					view: safeNumber(item.totalViews),
					nilai: safeNumber(item.totalScore),
				};
			} else {
				const user = item.user || {};
				return {
					id: item.id,
					uuid: user.uuid, // ⬅️ ambil uuid juga
					name: user.name || "Unknown",
					username: user.nama_akun || "-",
					avatar: user.url_foto_profile || profilePict,
					like: safeNumber(item.likes),
					comment: safeNumber(item.comments),
					view: safeNumber(item.video_views),
					nilai: safeNumber(item.score),
					url_postingan: item.url_postingan,
				};
			}
		}) || [];

	// sorting dinamis
	const sortedData = [...mappedData].sort((a, b) => {
		switch (orderBy) {
			case "likes":
				return b.like - a.like;
			case "comments":
				return b.comment - a.comment;
			case "views":
				return b.view - a.view;
			case "score":
				return b.nilai - a.nilai;
			case "total":
			default:
				return b.like + b.comment + b.view - (a.like + a.comment + a.view);
		}
	});

	// podium top 3
	const topUsers = sortedData
		.slice(0, 3)
		.map((u, i) => ({ ...u, rank: i + 1 }));

	const orderOptions = [
		{ label: "Total (likes+comments+views)", value: "total" },
		{ label: "Likes", value: "likes" },
		{ label: "Comments", value: "comments" },
		{ label: "Views", value: "views" },
		{ label: "Score", value: "score" },
	];

	// data yang tampil di halaman sekarang
	const paginatedData = sortedData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const onPageChange = (e) => {
		setCurrentPage(e.page + 1); // PrimeReact paginator page index mulai dari 0
	};

	return (
		<>
			<Navbar />
			<div className="bg-gradient-to-b from-primary to-secondary min-h-screen text-white p-3 font-jakarta">
				{/* Tabs + Dropdown */}
				<div className="flex justify-center rank-btn mb-4">
					<Dropdown
						value={orderBy}
						options={orderOptions}
						onChange={(e) => setOrderBy(e.value)}
						placeholder="Sort By"
						className="mr-4 w-60"
					/>
					{["Account", "Post"].map((name) => (
						<button
							key={name}
							className={`btn-top-rank ${
								activeButton === name ? "btn-active" : "btn-inactive"
							}`}
							onClick={() => setActiveButton(name)}
						>
							Top {name}
						</button>
					))}
				</div>

				{/* Leaderboard */}
				<div className="grid lg:grid-cols-2 justify-content-center gap-4 md:gap-8 max-w-7xl mx-auto">
					{/* Top 3 Podium */}
					<div className="col-12 lg:col ">
						<div className="flex align-items-end justify-content-center gap-3 md:gap-6 mb-6 md:mb-12">
							{[2, 1, 3].map((rank) => {
								const user = topUsers.find((u) => u.rank === rank);
								if (!user) return null;

								const value =
									orderBy === "total"
										? Number(user.like) +
										  Number(user.comment) +
										  Number(user.view)
										: orderBy === "likes"
										? Number(user.like)
										: orderBy === "comments"
										? Number(user.comment)
										: orderBy === "views"
										? Number(user.view)
										: Number(user.nilai);

								return (
									<div
										key={rank}
										className="flex  flex-column align-items-center"
									>
										<div className="text-center  flipleft animation-duration-2000 mb-4 md:mb-6">
											<img
												src={user.avatar}
												onClick={(e) => {
													e.stopPropagation();
													openEditModal(user.uuid);
												}}
												alt={user.name}
												className="podium-avatar cursor-pointer "
											/>
											<p className="podium-name">{user.name}</p>
											<p className="podium-username">@{user.username}</p>
											<p className="podium-value">{value.toLocaleString()}</p>
										</div>
										<div
											className={`fadeindown   animation-duration-1000 podium-bar ${
												rank === 1
													? "bar-one"
													: rank === 2
													? "bar-two"
													: "bar-three"
											}`}
										>
											<div className="podium-rank">{rank}</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Table Detail */}
					<div className="fadein animation-duration-2000 bg-gray-900/70 border-round-xl p-0 overflow-hidden container-table-detail">
						<div className="lead-table-container">
							<div className="lead-table-detail">
								{/* Header */}
								<div className="lead-table-row bg-gray-800 text-gray-300 text-xs md:text-sm font-semibold">
									<div className="lead-table-header col-rank">Rank</div>
									<div className="lead-table-header col-name">Nama</div>
									<div className="lead-table-header col-username">Username</div>
									<div className="lead-table-header col-number">Like</div>
									<div className="lead-table-header col-number">Comment</div>
									<div className="lead-table-header col-number">View</div>
									<div className="lead-table-header col-score">Nilai</div>
									{activeButton === "Post" && (
										<div className="lead-table-header col-link">Link</div>
									)}
								</div>

								{/* Rows */}
								{paginatedData.map((user, index) => (
									<div
										key={user.id}
										className=" lead-table-row bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer"
									>
										<div className="lead-table-cell col-rank">
											{" "}
											{(currentPage - 1) * itemsPerPage + index + 1}
										</div>
										<div
											className="cursor-pointer lead-table-cell col-name"
											onClick={() => openEditModal(user.uuid)}
										>
											{user.name}
										</div>
										<div className="lead-table-cell col-username">
											@{user.username}
										</div>
										<div className="lead-table-cell col-number">
											{user.like.toLocaleString()}
										</div>
										<div className="lead-table-cell col-number">
											{user.comment.toLocaleString()}
										</div>
										<div className="lead-table-cell col-number">
											{user.view.toLocaleString()}
										</div>
										<div className="lead-table-cell col-score">
											{user.nilai.toLocaleString()}
										</div>
										{activeButton === "Post" && (
											<div className="lead-table-cell col-link">
												<a
													href={user.url_postingan}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-400 hover:underline text-xs"
												>
													Link
												</a>
											</div>
										)}
									</div>
								))}
							</div>
							{/* Pagination Controls */}
							{sortedData.length > itemsPerPage && (
								<Paginator
									first={(currentPage - 1) * itemsPerPage}
									rows={itemsPerPage}
									totalRecords={sortedData.length}
									onPageChange={onPageChange}
									className="mt-4"
									style={{ backgroundColor: "transparent" }} // background transparan
								/>
							)}
						</div>
					</div>

					{/* Modal */}
					<UserModal
						lassName="gradient-bordermoda"
						isOpen={isModalOpen}
						closeModal={() => setIsModalOpen(false)}
						user={userDetail}
					/>
				</div>
			</div>
		</>
	);
};

export default Leaderboard;
