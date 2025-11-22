"use client";

import styles from "../components/component.module.css";
import useUserStore from "@/stores/userStore";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Sidebar({ currentView, onMenuClick }) {
	const user = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.setUser);
	const toast = useToast()

	useEffect(() => {
		setAdmin();
	}, []);

	const setAdmin = async () => {
		await axios
			.get("http://localhost:55561/user/reserves/admin@mail.com")
			.then((res) => {
				setUser(res.data);
			})
			.catch((err) => {
				console.error("Error fetching user:", err);
			});
	}

	const fetchUser = async (email) => {
		await axios
			.get(`http://localhost:55561/user/reserves/${email}`)
			.then((res) => {
				setUser(res.data);
			})
			.catch((err) => {
				console.error("Error fetching user:", err);
			});
	};

	const handleSwitchUser = async () => {
		try {
			if (!user) {
				await fetchUser("admin@mail.com");
				router.push("/user");
				return;
			}

			const isAdmin = user.email === "admin@mail.com";

			if (isAdmin) {
				await fetchUser("testuser@mail.com");
			} else {
				await fetchUser("admin@mail.com");
			}

		} catch (err) {
			console.error("Failed to switch user:", err);
		}
	};


	return (
		<div className={styles.sidebar}>
			<span className={styles.adminHeader}>
				<strong>{user?.email === "admin@mail.com" ? "Admin" : "User"}</strong>
			</span>

			<div
				role="button"
				className={`${styles.menu} ${currentView === "home" ? styles.activeMenu : ""
					}`}
				onClick={() => onMenuClick("home")}
			>
				<i className={`bi bi-house-door ${styles.bigIcon}`}></i><span>Home</span>
			</div>

			<div
				role="button"
				className={`${styles.menu} ${currentView === "history" ? styles.activeMenu : ""
					}`}
				onClick={() => onMenuClick("history")}
			>
				<i className={`bi bi-inbox ${styles.bigIcon}`}></i><span>History</span>
			</div>

			{/* Toggle user */}
			<div role="button" className={styles.menu} onClick={handleSwitchUser}>
				<i className={`bi bi-arrow-repeat ${styles.bigIcon}`}></i>
					<span>
						{user ? user.email === "admin@mail.com"
							? "Switch to user"
							: "Switch to admin"
						: "Load admin"}
					</span>
			</div>

			<div role="button" className={styles.menuLogout} onClick={() => {
				toast({
					position: 'top-right',
					title: 'Under Construction.',
					description: "",
					status: 'info',
					duration: 3000,
					isClosable: true,
				})
			}}><i className={`bi bi-box-arrow-right ${styles.bigIcon}`}></i>Logout</div>
		</div>
	);
}
