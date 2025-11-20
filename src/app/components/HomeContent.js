"use client";

import styles from "./component.module.css";
import { Button } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Text,
	Heading,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	FormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText,
	Input,
	InputGroup,
	InputRightElement,
	Textarea,
} from "@chakra-ui/react";
import axios from "axios";

export default function HomeContent() {
	const [cards, setCards] = useState([]);

	useEffect(() => {
		getAllConcert();
	}, []);

	const getAllConcert = () => {
		axios
		.get("http://localhost:3000/concert")
		.then((res) => {
			const converted = res.data.map((c) => ({
				id: c._id,
				title: c.title,
				description: c.description,
				ticket: c.ticket,
		}));
			setCards(converted);
		})
		.catch((err) => {
			console.error("Error fetching concerts:", err);
		});
	}

	const createNewConcert = (concert) => {
		axios
		.post("http://localhost:3000/concert", concert)
		.then((res) => {
			getAllConcert();
		})
		.catch((err) => {
			console.error("Error creating concert:", err);
		});
	}

	const deleteConcert = (id) => {
		axios
		.delete(`http://localhost:3000/concert/${id}`)
		.then((res) => {
			getAllConcert();
		})
		.catch((err) => {
			console.error("Error deleting concert:", err);
		});
		setIsOpen(false);
	}

	const handleCreate = () => {
		const now = new Date().toISOString();

		const concert = {
			title: newTitle,
			description: newDescription,
			ticket: Number(newTicket),
			createDate: now,
			updateDate: now
		};

		createNewConcert(concert);

		// Optional: clear form
		setNewTitle("");
		setNewDescription("");
		setNewTicket("");
	};

	//Sum concert ticket
	const sum_ticket = cards.reduce((acc, card) => {
		return acc + Number(card.ticket);
	}, 0);

	const [isOpen, setIsOpen] = useState(false); //Confirm Delete Dialog
	const [deleteId, setDeleteId] = useState(null); //Set Delete Card Id
	const [deleteTitle, setDeleteTitle] = useState(null); //Set Delete Card Title
	const cancelRef = useRef(); // for focus

	const openDeleteDialog = (id, title) => {
		setDeleteId(id);
		setDeleteTitle(title);
		setIsOpen(true);
	};

	const confirmDelete = () => {
		setCards((prev) => prev.filter((card) => card.id !== deleteId));
		setIsOpen(false);
	};

	const [newTitle, setNewTitle] = useState("");
	const [newTicket, setNewTicket] = useState("");
	const [newDescription, setNewDescription] = useState("");

	const handleTitleChange = (e) => {
		setNewTitle(e.target.value);
		// console.log("Title:", e.target.value);
	};

	const handleTicketChange = (e) => {
		setNewTicket(e.target.value);
		// console.log("Total Seats:", e.target.value);
	};
	
	const handleDescriptionChange = (e) => {
		setNewDescription(e.target.value);
		// console.log("Description:", e.target.value);
	};

	return (
		<div className={styles.homeContainer}>
			<div className={styles.headSection}>
				{/* Total Card */}
				<Card
					className={styles.headSectionItem}
					backgroundColor="blue.500"
					color="white"
				>
					<i className="bi bi-person" style={{ fontSize: "3rem" }}></i>
					<Text fontWeight={500} fontSize="22px">
						Total of seats
					</Text>
					<Heading size="md" fontSize="40px">
						{sum_ticket}
					</Heading>
				</Card>
				{/* Reserve Card */}
				<Card
					className={styles.headSectionItem}
					backgroundColor="gray.400"
					color="white"
				>
					<i className="bi bi-award" style={{ fontSize: "3rem" }}></i>
					<Text fontWeight={500} fontSize="22px">
						Reserve
					</Text>
					<Heading size="md" fontSize="40px">
						120
					</Heading>
				</Card>
				{/* Cancel Card */}
				<Card
					className={styles.headSectionItem}
					backgroundColor="orange.500"
					color="white"
				>
					<i className="bi bi-x-circle" style={{ fontSize: "3rem" }}></i>
					<Text fontWeight={500} fontSize="22px">
						Cancel
					</Text>
					<Heading size="md" fontSize="40px">
						12
					</Heading>
				</Card>
			</div>

			<div className={styles.bodySection}>
				<Tabs>
					<TabList zIndex={9999} height={50}>
						<Tab>Overview</Tab>
						<Tab>Create</Tab>
					</TabList>

					<TabPanels>
						{/* Overview */}
						<TabPanel className={styles.cardsContainer}>
							{cards.map((item, index) => (
								<Card key={index}>
									<CardHeader height="3rem">
										<Heading size="md" color="blue.400">
											{item.title}
										</Heading>
									</CardHeader>
									<CardBody>
										<Text>{item.description}</Text>
									</CardBody>
									<CardFooter className={styles.cardFooter}>
										<span>
											<i className="bi bi-person pr-2"></i>
											<span style={{ marginLeft: "5px" }}>{item.ticket}</span>
										</span>
										<div className="d-flex flex-row gap-2">
											{/* <Button
												colorScheme="green"
												onClick={() => openDeleteDialog(item.id, item.title)}
											>
												Edit
											</Button>*/}
											<Button
												colorScheme="red"
												onClick={() => openDeleteDialog(item.id, item.title)}
											>
												Delete
											</Button>
										</div>
									</CardFooter>
								</Card>
							))}
						</TabPanel>
						{/* Create */}
						<TabPanel>
							<Card>
								<CardHeader
									fontSize={38}
									fontWeight={700}
									color="blue.400"
									paddingBottom={0}
								>
									Create
									<hr></hr>
								</CardHeader>
								<CardBody paddingTop={2} className="d-flex flex-column gap-3">
									<div className="d-flex flex-row gap-4">
										<FormControl className="d-flex flex-column gap-2">
											<FormLabel fontSize={22} fontWeight={500}>
												Concert Name
											</FormLabel>
											<Input
												type="text"
												placeholder="Input concert name"
												value={newTitle}
												onChange={handleTitleChange}
												required
											></Input>
										</FormControl>
										<FormControl className="d-flex flex-column gap-2">
											<FormLabel fontSize={22} fontWeight={500}>
												Total of seat
											</FormLabel>
											<InputGroup>
												<Input
													type="number"
													placeholder="Input total seat eg.500"
													value={newTicket}
													onChange={handleTicketChange}
													required
												/>
												<InputRightElement>
													<i className="bi bi-person"></i>
												</InputRightElement>
											</InputGroup>
										</FormControl>
									</div>
									<div>
										<FormControl>
											<FormLabel fontSize={22} fontWeight={500}>
												Description
											</FormLabel>
											<Textarea
												placeholder="Input concert description"
												value={newDescription}
												onChange={handleDescriptionChange}
												required
											/>
										</FormControl>
									</div>
								</CardBody>
								<CardFooter justify="end" paddingTop={0}>
									<Button colorScheme="blue" paddingInline={8} onClick={handleCreate}>
										<i
											className="bi bi-floppy"
											style={{ paddingRight: "10px" }}
										></i>{" "}
										Save
									</Button>
								</CardFooter>
							</Card>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</div>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={() => setIsOpen(false)}
				isCentered={true}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader
							fontSize="lg"
							fontWeight="bold"
							align="center"
							paddingBlock={2}
						>
							<i
								className="bi bi-x-circle-fill"
								style={{ fontSize: "40px", color: "red" }}
							></i>
							{/* Delete Concert*/}
						</AlertDialogHeader>

						<AlertDialogBody>
							<Text
								fontWeight={500}
								fontSize={22}
								align="center"
								marginBottom={3}
							>
								Are you sue to delete?
							</Text>
							<Text fontWeight={500} fontSize={20} align="center">
								"{deleteTitle}"
							</Text>
						</AlertDialogBody>

						<AlertDialogFooter width="100%">
							<Button
								ref={cancelRef}
								onClick={() => setIsOpen(false)}
								width="50%"
							>
								Cancel
							</Button>
							<Button
								colorScheme="red"
								onClick={() => {
									deleteConcert(deleteId);
								}}
								ml={3}
								width="50%"
							>
								Yes, Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</div>
	);
}
