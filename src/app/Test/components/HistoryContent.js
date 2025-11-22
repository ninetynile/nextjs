"use client";

import axios from "axios";
import moment from "moment";
import { useState, useEffect } from "react";
import styles from "./component.module.css";
import useUserStore from "@/stores/userStore";

export default function HistoryContent() {
	const [transactions, setTransactions] = useState([]);
	const user = useUserStore((state) => state.user);

	useEffect(() => {
		getAllTransaction();
	}, [user]); 

	const getAllTransaction = async () => {
		try {
			let url = "http://localhost:55561/reserve/trn";
			if (user?.email !== "admin@mail.com") {
				url = `http://localhost:55561/reserve/trn/user/${user._id}`;
			}

			const res = await axios.get(url);
			let data = res.data;

			const converted = data.map((c) => ({
				id: c._id,
				userId: c.userId,
				userName: c.userName,
				concertId: c.concertId,
				concertTitle: c.concertTitle,
				action: c.action,
				createDate: c.createDate,
			}));

			setTransactions(converted);
		} catch (err) {
			console.error("Error fetching transaction:", err);
		}
	};

	return (
		<div className={styles.homeContainer}>
			<table className={`table table-bordered ${styles.tableCustom}`} style={{ emptyCells: "hide" }}>
				<thead className={`sticky-top ${styles.thead}`}>
					<tr>
						<th>#</th>
						<th>Date</th>
						<th>Username</th>
						<th>Concert Title</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{transactions.map((item, index) => (
						<tr key={index}>
							<td>{index + 1}</td>
							<td>{moment(item.createDate).format("DD/MM/YYYY HH:mm:ss")}</td>
							<td>{item.userName}</td>
							<td>{item.concertTitle}</td>
							<td>{item.action}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
