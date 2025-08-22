import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import { useState } from "react";

const Layout = ({ children }) => {
	return (
		<div>
			<React.Fragment>
				<div className="md:flex min-w-screen justify-content-start md:gap-7 md:overflow-hidden py-3 md:max-h-screen">
					<div className="md:flex sidebar flex-1 fixed z-5 md:static md:px-4   bottom-0">
						<Sidebar />
					</div>
					<div className="md:overflow-y-auto flex-8 justify-content-start childerContent  md:overflow-x-hidden">
						<main>{children}</main>
					</div>
				</div>
			</React.Fragment>
		</div>
	);
};

export default Layout;
