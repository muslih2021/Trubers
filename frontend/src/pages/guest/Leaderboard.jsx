// import Navbar from "../../components/guest/Navbar.jsx";
// import React, { useState } from "react";
// import useSWR from "swr";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { Dropdown } from "primereact/dropdown";
// import { Avatar } from "primereact/avatar";
// import "primeflex/primeflex.css";

// // fetcher untuk SWR
// const fetcher = (url) => fetch(url).then((res) => res.json());

// // helper untuk fallback 0
// const safeNumber = (value) => (value != null ? value : 0);
// const Leaderboard = () => {
// 	const [activeButton, setActiveButton] = useState("Account");

// 	const [orderBy, setOrderBy] = useState("total");

// 	// fetch data dari backend
// 	const { data, error, isLoading } = useSWR(
// 		`http://localhost:5000/ContentReportByUserRank?orderBy=${orderBy}`,
// 		fetcher
// 	);

// 	if (isLoading) return <p>Loading...</p>;
// 	if (error) return <p>Error: {error.message}</p>;

// 	// opsi sorting
// 	const orderOptions = [
// 		{ label: "Total (likes+comments+views)", value: "total" },
// 		{ label: "Likes", value: "likes" },
// 		{ label: "Comments", value: "comments" },
// 		{ label: "Views", value: "views" },
// 		{ label: "Score", value: "score" },
// 	];

// 	return (
// 		<>
// 			<Navbar />

// 			<div className="bg-gradient-to-b from-primary to-secondary min-h-screen text-white p-3 md:p-6 font-jakarta">
// 				{/* Tabs */}
// 				<div className="flex justify-center rank-btn">
// 					<Dropdown
// 						value={orderBy}
// 						options={orderOptions}
// 						onChange={(e) => setOrderBy(e.value)}
// 						placeholder="Sort By"
// 						className="mb-4 w-60"
// 					/>

// 					{["Account", "Post"].map((name) => (
// 						<button
// 							key={name}
// 							className={`btn-top-rank ${
// 								activeButton === name ? "btn-active" : "btn-inactive"
// 							}`}
// 							onClick={() => setActiveButton(name)}
// 						>
// 							Top {name}
// 						</button>
// 					))}
// 				</div>

// 				{/* Kolom: Leaderboard & Table Detail */}
// 				<div className="grid lg:grid-cols-2 gap-4 md:gap-8 max-w-7xl mx-auto">
// 					{/* Leaderboard */}
// 					<div className="col-12  lg:col">
// 						{/* Top 3 Podium */}
// 						<div className="flex align-items-end justify-content-center gap-3 md:gap-6 mb-6 md:mb-12">
// 							{/* Rank 2 */}
// 							{topUsers.find((u) => u.rank === 2) && (
// 								<div className="flex flex-column align-items-center">
// 									<div className="text-center mb-4 md:mb-6">
// 										<img
// 											src={topUsers.find((u) => u.rank === 2).avatar}
// 											alt={topUsers.find((u) => u.rank === 2).name}
// 											className="w-6 h-6 md:w-20 md:h-20 border-circle mb-2"
// 										/>
// 										<p className="font-semibold text-sm md:text-base">
// 											{topUsers.find((u) => u.rank === 2).name}
// 										</p>
// 										<p className="font-semibold text-neutral-400 text-xs md:text-sm">
// 											{topUsers.find((u) => u.rank === 2).username}
// 										</p>
// 										<p className="text-white text-lg md:text-xl mt-2 md:mt-4">
// 											{topUsers.find((u) => u.rank === 2).nilai}
// 										</p>
// 									</div>
// 									<div className="flex flex-column align-items-center justify-content-start px-3 md:px-4 pt-6 md:pt-8 border-round bg-gradient-to-b from-neutral-200 to-neutral-700 bar-two">
// 										<h3 className="text-4xl font-bold m-0">2</h3>
// 									</div>
// 								</div>
// 							)}

// 							{/* Rank 1 */}
// 							{topUsers.find((u) => u.rank === 1) && (
// 								<div className="flex flex-column align-items-center">
// 									<div className="text-center mb-4 md:mb-6">
// 										<img
// 											src={topUsers.find((u) => u.rank === 1).avatar}
// 											alt={topUsers.find((u) => u.rank === 1).name}
// 											className="w-6 h-6 md:w-20 md:h-20 border-circle mb-2"
// 										/>
// 										<p className="font-semibold text-sm md:text-base">
// 											{topUsers.find((u) => u.rank === 1).name}
// 										</p>
// 										<p className="font-semibold text-neutral-400 text-xs md:text-sm">
// 											{topUsers.find((u) => u.rank === 1).username}
// 										</p>
// 										<p className="text-white text-lg md:text-xl mt-2 md:mt-4">
// 											{topUsers.find((u) => u.rank === 1).nilai}
// 										</p>
// 									</div>
// 									<div className="flex flex-column align-items-center justify-content-start px-3 md:px-4 pt-8 md:pt-10 border-round bg-gradient-to-b from-yellow-200 to-yellow-900 bar-one">
// 										<h3 className="text-4xl font-bold m-0">1</h3>
// 									</div>
// 								</div>
// 							)}

// 							{/* Rank 3 */}
// 							{topUsers.find((u) => u.rank === 3) && (
// 								<div className="flex flex-column align-items-center">
// 									<div className="text-center mb-4 md:mb-6">
// 										<img
// 											src={topUsers.find((u) => u.rank === 3).avatar}
// 											alt={topUsers.find((u) => u.rank === 3).name}
// 											className="w-6 h-6 md:w-20 md:h-20 border-circle mb-2"
// 										/>
// 										<p className="font-semibold text-sm md:text-base">
// 											{topUsers.find((u) => u.rank === 3).name}
// 										</p>
// 										<p className="font-semibold text-neutral-400 text-xs md:text-sm">
// 											{topUsers.find((u) => u.rank === 3).username}
// 										</p>
// 										<p className="text-white text-lg md:text-xl mt-2 md:mt-4">
// 											{topUsers.find((u) => u.rank === 3).nilai}
// 										</p>
// 									</div>
// 									<div className="flex flex-column align-items-center justify-content-start px-3 md:px-4 pt-6 md:pt-8 border-round bg-gradient-to-b from-amber-100 to-amber-800 bar-three">
// 										<h3 className="text-4xl font-bold m-0">3</h3>
// 									</div>
// 								</div>
// 							)}
// 						</div>
// 					</div>

// 					{/* Tabel Detail Keterangan */}
// 					<div className="col-12 lg:col bg-gray-900/70 border-round-xl overflow-y-auto md:overflow-hidden">
// 						{/* Header */}
// 						<div className="grid grid-nogutter bg-gray-800 text-gray-300 text-sm px-3 md:px-4 py-2 md:py-3 font-semibold">
// 							<div
// 								className="col-fixed text-center text-xs md:text-base"
// 								style={{ width: "2.5rem" }}
// 							>
// 								Rank
// 							</div>
// 							<div className="col-2 text-xs">Nama</div>
// 							<div className="col-2 text-xs">Username</div>
// 							<div className="col text-center text-xs">Like</div>
// 							<div className="col text-center text-xs">Comment</div>
// 							<div className="col text-center text-xs">View</div>
// 							<div className="col text-center text-xs">Nilai</div>
// 						</div>

// 						{/* Rows - menggunakan index untuk menampilkan rank berurutan */}
// 						{sortedUsers.map((user, index) => (
// 							<div
// 								key={user.id}
// 								className="grid grid-nogutter align-items-center px-3 md:px-4 py-2 md:py-3 bg-gray-900 border-bottom-1 border-gray-700 last:border-none"
// 							>
// 								<div
// 									className="col-fixed text-center font-semibold"
// 									style={{ width: "2.5rem" }}
// 								>
// 									{/* Menampilkan angka berurutan dari 1 */}
// 									{index + 1}
// 								</div>
// 								<div className="col-2 text-xs md:text-base">{user.name}</div>
// 								<div className="col-2 text-gray-400 text-xs">
// 									{user.username}
// 								</div>
// 								<div className="col text-center text-xs md:text-base">
// 									{user.like}
// 								</div>
// 								<div className="col text-center text-xs md:text-base">
// 									{user.comment}
// 								</div>
// 								<div className="col text-center text-xs md:text-base">
// 									{user.view.toLocaleString()}
// 								</div>
// 								<div className="col text-center font-semibold text-xs md:text-base">
// 									{user.nilai}
// 								</div>
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default Leaderboard;
// import Navbar from "../../components/guest/Navbar.jsx";
// import React, { useState } from "react";
// import useSWR from "swr";
// import { Dropdown } from "primereact/dropdown";
// import { Avatar } from "primereact/avatar";
// import "primeflex/primeflex.css";

// // fetcher SWR
// const fetcher = (url) => fetch(url).then((res) => res.json());

// // fallback helper
// const safeNumber = (value) => (value != null ? value : 0);

// const Leaderboard = () => {
// 	const [activeButton, setActiveButton] = useState("Account");
// 	const [orderBy, setOrderBy] = useState("total");

// 	// URL berdasarkan tab
// 	const url =
// 		activeButton === "Account"
// 			? `http://localhost:5000/ContentReportByUserRank?orderBy=${orderBy}`
// 			: `http://localhost:5000/ContentReportByPostRank?orderBy=${orderBy}`;

// 	const { data, error, isLoading } = useSWR(url, fetcher);

// 	if (isLoading) return <p>Loading...</p>;
// 	if (error) return <p>Error: {error.message}</p>;

// 	// mapping data
// 	const mappedData =
// 		data?.map((u) => ({
// 			id: u.id,
// 			name: u.name,
// 			username: u.nama_akun, // atau username
// 			avatar: u.url_foto_profile || `https://i.pravatar.cc/150?img=${u.id}`,
// 			like: safeNumber(u.totalLikes),
// 			comment: safeNumber(u.totalComments),
// 			view: safeNumber(u.totalViews),
// 			nilai: safeNumber(u.totalScore),
// 		})) || [];

// 	// sorting dinamis berdasarkan orderBy
// 	const sortedData = [...mappedData].sort((a, b) => {
// 		switch (orderBy) {
// 			case "likes":
// 				return b.like - a.like;
// 			case "comments":
// 				return b.comment - a.comment;
// 			case "views":
// 				return b.view - a.view;
// 			case "score":
// 				return b.nilai - a.nilai;
// 			case "total":
// 			default:
// 				return b.like + b.comment + b.view - (a.like + a.comment + a.view);
// 		}
// 	});

// 	// podium top 3
// 	const topUsers = sortedData
// 		.slice(0, 3)
// 		.map((u, i) => ({ ...u, rank: i + 1 }));

// 	const orderOptions = [
// 		{ label: "Total (likes+comments+views)", value: "total" },
// 		{ label: "Likes", value: "likes" },
// 		{ label: "Comments", value: "comments" },
// 		{ label: "Views", value: "views" },
// 		{ label: "Score", value: "score" },
// 	];

// 	return (
// 		<>
// 			<Navbar />

// 			<div className="bg-gradient-to-b from-primary to-secondary min-h-screen text-white p-3 md:p-6 font-jakarta">
// 				{/* Tabs + Dropdown */}
// 				<div className="flex justify-center rank-btn mb-4">
// 					<Dropdown
// 						value={orderBy}
// 						options={orderOptions}
// 						onChange={(e) => setOrderBy(e.value)}
// 						placeholder="Sort By"
// 						className="mr-4 w-60"
// 					/>
// 					{["Account", "Post"].map((name) => (
// 						<button
// 							key={name}
// 							className={`btn-top-rank ${
// 								activeButton === name ? "btn-active" : "btn-inactive"
// 							}`}
// 							onClick={() => setActiveButton(name)}
// 						>
// 							Top {name}
// 						</button>
// 					))}
// 				</div>

// 				{/* Leaderboard + Table */}
// 				<div className="grid lg:grid-cols-2 gap-4 md:gap-8 max-w-7xl mx-auto">
// 					{/* Top 3 Podium */}
// 					<div className="col-12 lg:col">
// 						<div className="flex align-items-end justify-content-center gap-3 md:gap-6 mb-6 md:mb-12">
// 							{[2, 1, 3].map((rank) => {
// 								const user = topUsers.find((u) => u.rank === rank);
// 								if (!user) return null;
// 								return (
// 									<div
// 										key={rank}
// 										className="flex flex-column align-items-center"
// 									>
// 										<div className="text-center mb-4 md:mb-6">
// 											<img
// 												src={user.avatar}
// 												alt={user.name}
// 												className="w-6 h-6 md:w-20 md:h-20 border-circle mb-2"
// 											/>
// 											<p className="font-semibold text-sm md:text-base">
// 												{user.name}
// 											</p>
// 											<p className="font-semibold text-neutral-400 text-xs md:text-sm">
// 												{user.username}
// 											</p>
// 											<div className="col text-center font-semibold text-xs md:text-base">
// 												{orderBy === "total"
// 													? Number(user.like) +
// 													  Number(user.comment) +
// 													  Number(user.view)
// 													: orderBy === "likes"
// 													? Number(user.like)
// 													: orderBy === "comments"
// 													? Number(user.comment)
// 													: orderBy === "views"
// 													? Number(user.view)
// 													: Number(user.nilai)}
// 											</div>
// 										</div>
// 										<div
// 											className={`flex flex-column align-items-center justify-content-start px-3 md:px-4 pt-6 md:pt-8 border-round ${
// 												rank === 1
// 													? "bg-gradient-to-b from-yellow-200 to-yellow-900 bar-one"
// 													: rank === 2
// 													? "bg-gradient-to-b from-neutral-200 to-neutral-700 bar-two"
// 													: "bg-gradient-to-b from-amber-100 to-amber-800 bar-three"
// 											}`}
// 										>
// 											<h3 className="text-4xl font-bold m-0">{rank}</h3>
// 										</div>
// 									</div>
// 								);
// 							})}
// 						</div>
// 					</div>

// 					{/* Table Detail */}
// 					<div className="col-12 lg:col bg-gray-900/70 border-round-xl overflow-y-auto md:overflow-hidden">
// 						<div className="grid grid-nogutter bg-gray-800 text-gray-300 text-sm px-3 md:px-4 py-2 md:py-3 font-semibold">
// 							<div
// 								className="col-fixed text-center text-xs md:text-base"
// 								style={{ width: "2.5rem" }}
// 							>
// 								Rank
// 							</div>
// 							<div className="col-2 text-xs">Nama</div>
// 							<div className="col-2 text-xs">Username</div>
// 							<div className="col text-center text-xs">Like</div>
// 							<div className="col text-center text-xs">Comment</div>
// 							<div className="col text-center text-xs">View</div>
// 							<div className="col text-center text-xs">Nilai</div>
// 						</div>

// 						{sortedData.map((user, index) => (
// 							<div
// 								key={user.id}
// 								className="grid grid-nogutter align-items-center px-3 md:px-4 py-2 md:py-3 bg-gray-900 border-bottom-1 border-gray-700 last:border-none"
// 							>
// 								<div
// 									className="col-fixed text-center font-semibold"
// 									style={{ width: "2.5rem" }}
// 								>
// 									{index + 1}
// 								</div>
// 								<div className="col-2 text-xs md:text-base">{user.name}</div>
// 								<div className="col-2 text-gray-400 text-xs">
// 									{user.username}
// 								</div>
// 								<div className="col text-center text-xs md:text-base">
// 									{user.like.toLocaleString()}
// 								</div>
// 								<div className="col text-center text-xs md:text-base">
// 									{user.comment.toLocaleString()}
// 								</div>
// 								<div className="col text-center text-xs md:text-base">
// 									{user.view.toLocaleString()}
// 								</div>
// 								<div className="col text-center font-semibold text-xs md:text-base">
// 									{user.nilai}
// 								</div>
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default Leaderboard;
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
								return (
									<div
										key={rank}
										className="flex flex-column align-items-center"
									>
										<div className="text-center mb-4 md:mb-6">
											<img
												src={user.avatar}
												alt={user.name}
												className="w-6 h-6 md:w-20 md:h-20 border-circle mb-2"
											/>
											<p className="font-semibold text-sm md:text-base">
												{user.name}
											</p>
											<p className="font-semibold text-neutral-400 text-xs md:text-sm">
												{user.username}
											</p>
											<div className="col text-center font-semibold text-xs md:text-base">
												{orderBy === "total"
													? Number(user.like) +
													  Number(user.comment) +
													  Number(user.view)
													: orderBy === "likes"
													? Number(user.like)
													: orderBy === "comments"
													? Number(user.comment)
													: orderBy === "views"
													? Number(user.view)
													: Number(user.nilai)}
											</div>
										</div>
										<div
											className={`flex flex-column align-items-center justify-content-start px-3 md:px-4 pt-6 md:pt-8 border-round ${
												rank === 1
													? "bg-gradient-to-b from-yellow-200 to-yellow-900 bar-one"
													: rank === 2
													? "bg-gradient-to-b from-neutral-200 to-neutral-700 bar-two"
													: "bg-gradient-to-b from-amber-100 to-amber-800 bar-three"
											}`}
										>
											<h3 className="text-4xl font-bold m-0">{rank}</h3>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Table Detail */}
					<div className="col-12 lg:col bg-gray-900/70 border-round-xl overflow-y-auto md:overflow-hidden">
						<div className="grid grid-nogutter bg-gray-800 text-gray-300 text-sm px-3 md:px-4 py-2 md:py-3 font-semibold">
							<div
								className="col-fixed text-center text-xs md:text-base"
								style={{ width: "2.5rem" }}
							>
								Rank
							</div>
							<div className="col-2 text-xs">Nama</div>
							<div className="col-2 text-xs">Username</div>
							<div className="col text-center text-xs">Like</div>
							<div className="col text-center text-xs">Comment</div>
							<div className="col text-center text-xs">View</div>
							<div className="col text-center text-xs">Nilai</div>
							{activeButton === "Post" && (
								<div className="col text-center text-xs">Link</div>
							)}
						</div>

						{sortedData.map((user, index) => (
							<div
								key={user.id}
								className="grid grid-nogutter align-items-center px-3 md:px-4 py-2 md:py-3 bg-gray-900 border-bottom-1 border-gray-700 last:border-none"
							>
								<div
									className="col-fixed text-center font-semibold"
									style={{ width: "2.5rem" }}
								>
									{index + 1}
								</div>
								<div className="col-2 text-xs md:text-base">{user.name}</div>
								<div className="col-2 text-gray-400 text-xs">
									{user.username}
								</div>
								<div className="col text-center text-xs md:text-base">
									{user.like.toLocaleString()}
								</div>
								<div className="col text-center text-xs md:text-base">
									{user.comment.toLocaleString()}
								</div>
								<div className="col text-center text-xs md:text-base">
									{user.view.toLocaleString()}
								</div>
								<div className="col text-center font-semibold text-xs md:text-base">
									{user.nilai}
								</div>
								{activeButton === "Post" && (
									<div className="col text-center text-xs break-words">
										<a
											href={user.url_postingan}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-400 hover:underline"
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
		</>
	);
};

export default Leaderboard;
