import React, { useState } from "react";
import useSWR from "swr";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Avatar } from "primereact/avatar";

// fetcher untuk SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

// helper untuk fallback 0
const safeNumber = (value) => (value != null ? value : 0);

const Leaderboard = () => {
	const [orderBy, setOrderBy] = useState("total");

	// fetch data dari backend
	const { data, error, isLoading } = useSWR(
		`http://localhost:5000/ContentReportByUserRank?orderBy=${orderBy}`,
		fetcher
	);

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	// opsi sorting
	const orderOptions = [
		{ label: "Total (likes+comments+views)", value: "total" },
		{ label: "Likes", value: "likes" },
		{ label: "Comments", value: "comments" },
		{ label: "Views", value: "views" },
		{ label: "Score", value: "score" },
	];

	return (
		<div className="p-4">
			<h2 className="mb-4 text-xl font-bold">Leaderboard</h2>

			{/* Dropdown sort */}
			<Dropdown
				value={orderBy}
				options={orderOptions}
				onChange={(e) => setOrderBy(e.value)}
				placeholder="Sort By"
				className="mb-4 w-60"
			/>

			{/* Tabel leaderboard */}
			<DataTable value={data} responsiveLayout="scroll">
				{/* Nomor urut */}
				<Column
					header="#"
					body={(rowData, options) => options.rowIndex + 1}
					style={{ width: "3rem" }}
				/>

				{/* User + foto profil */}
				<Column
					header="User"
					body={(rowData) => (
						<div className="flex items-center gap-2">
							<Avatar
								image={rowData.url_foto_profile}
								shape="circle"
								size="large"
							/>
							<span>{rowData.name}</span>
						</div>
					)}
				/>

				<Column field="email" header="Email" />

				{/* Agregat values dengan fallback 0 */}
				<Column
					field="totalLikes"
					header="Likes"
					body={(row) => safeNumber(row.totalLikes)}
				/>
				<Column
					field="totalComments"
					header="Comments"
					body={(row) => safeNumber(row.totalComments)}
				/>
				<Column
					field="totalViews"
					header="Views"
					body={(row) => safeNumber(row.totalViews)}
				/>
				<Column
					field="totalScore"
					header="Score"
					body={(row) => safeNumber(row.totalScore)}
				/>
			</DataTable>
		</div>
	);
};

export default Leaderboard;
