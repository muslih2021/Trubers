import Navbar from "../../components/guest/Navbar.jsx";
import React, { useState } from "react";
import useSWR from "swr";
import { Dropdown } from "primereact/dropdown";
import "primeflex/primeflex.css";

// fetcher SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

// fallback helper
const safeNumber = (value) => (value != null ? value : 0);

const Leaderboard = () => {
	const [activeButton, setActiveButton] = useState("Account");
	const [orderBy, setOrderBy] = useState("total");

	// URL berdasarkan tab
	const url =
		activeButton === "Account"
			? `http://localhost:5000/ContentReportByUserRank?orderBy=${orderBy}`
			: `http://localhost:5000/ContentReportByPostRank?orderBy=${orderBy}`;

	const { data, error, isLoading } = useSWR(url, fetcher);

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	// mapping data
	const mappedData =
		data?.map((item) => {
			if (activeButton === "Account") {
				return {
					id: item.id,
					name: item.name,
					username: item.nama_akun || "-",
					avatar:
						item.url_foto_profile || `https://i.pravatar.cc/150?img=${item.id}`,
					like: safeNumber(item.totalLikes),
					comment: safeNumber(item.totalComments),
					view: safeNumber(item.totalViews),
					nilai: safeNumber(item.totalScore),
				};
			} else {
				const user = item.user || {};
				return {
					id: item.id,
					name: user.name || "Unknown",
					username: user.nama_akun || "-",
					avatar:
						user.url_foto_profile || `https://i.pravatar.cc/150?img=${item.id}`,
					like: safeNumber(item.likes),
					comment: safeNumber(item.comments),
					view: safeNumber(item.video_views),
					nilai: safeNumber(item.score),
					url_postingan: item.url_postingan,
				};
			}
		}) || [];

	// sorting dinamis berdasarkan orderBy
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

	return (
		<>
			<Navbar />
			<div className="bg-gradient-to-b from-primary to-secondary min-h-screen text-white p-3 md:p-6 font-jakarta">
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

				{/* Leaderboard + Table */}
				<div className="grid lg:grid-cols-2 gap-4 md:gap-8 max-w-7xl mx-auto">
					{/* Top 3 Podium */}
					<div className="col-12 lg:col">
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
										className="flex flex-column align-items-center"
									>
										<div className="text-center mb-4 md:mb-6">
											<img
												src={user.avatar}
												alt={user.name}
												className="podium-avatar"
											/>
											<p className="podium-name">{user.name}</p>
											<p className="podium-username">@{user.username}</p>
											<p className="podium-value">{value.toLocaleString()}</p>
										</div>
										<div
											className={`podium-bar ${
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
					<div className=" bg-gray-900/70 border-round-xl p-0 overflow-hidden container-table-detail">
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
								{sortedData.map((user, index) => (
									<div
										key={user.id}
										className="lead-table-row bg-gray-900 hover:bg-gray-800 transition-colors"
									>
										<div className="lead-table-cell col-rank font-semibold text-xs md:text-sm">
											{index + 1}
										</div>
										<div
											className="lead-table-cell col-name text-xs md:text-sm"
											title={user.name}
										>
											{user.name}
										</div>
										<div
											className="lead-table-cell col-username text-gray-400 text-xs"
											title={user.username}
										>
											@{user.username}
										</div>
										<div className="lead-table-cell col-number text-xs md:text-sm">
											{user.like.toLocaleString()}
										</div>
										<div className="lead-table-cell col-number text-xs md:text-sm">
											{user.comment.toLocaleString()}
										</div>
										<div className="lead-table-cell col-number text-xs md:text-sm">
											{user.view.toLocaleString()}
										</div>
										<div className="lead-table-cell col-score text-xs md:text-sm">
											{user.nilai.toLocaleString()}
										</div>
										{activeButton === "Post" && (
											<div className="lead-table-cell col-link">
												<a
													href={user.url_postingan}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-400 hover:underline text-xs"
													title="Buka postingan"
												>
													Link
												</a>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Leaderboard;
