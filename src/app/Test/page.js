// src/app/NewPage.js

"use client";

import { useState } from "react";
import styles from "./page.module.css"; // Assuming your CSS module is here

// 1. Import the new external components
import HomeContent from "../components/HomeContent.js";
import HistoryContent from "../components/HistoryContent.js";

export default function Test() {
	const [currentView, setCurrentView] = useState("home");

	const handleMenuClick = (viewName) => {
		setCurrentView(viewName);
	};

	// 2. The conditional rendering logic is cleaner using imported components
	const renderMainContent = () => {
		switch (currentView) {
			case "home":
				return <HomeContent />;
			case "history":
				return <HistoryContent />;
			default:
				return <HomeContent />;
		}
	};

	return (
		<div className={styles.page}>
			{/* Sidebar - Menu Items (unchanged) */}
			<div className={styles.sidebar}>
				<span className={styles.adminHeader} style={{ paddingLeft: "20px" }}>
					<strong>Admin</strong>
				</span>

				<div
					role="button"
					className={`${styles.menu} ${
						currentView === "home" ? styles.activeMenu : ""
					}`}
					onClick={() => handleMenuClick("home")}
				>
					<i className={`bi bi-house-door ${styles.bigIcon}`}></i>Home
				</div>

				<div
					role="button"
					className={`${styles.menu} ${
						currentView === "history" ? styles.activeMenu : ""
					}`}
					onClick={() => handleMenuClick("history")}
				>
					<i className={`bi bi-inbox ${styles.bigIcon}`}></i>History
				</div>

				<div role="button" className={styles.menu}>
					<i className={`bi bi-arrow-repeat ${styles.bigIcon}`}></i>Switch to
					user
				</div>
			</div>

			{/* Main Content Area */}
			<div className={styles.mainContent}>{renderMainContent()}</div>
		</div>
	);
}
