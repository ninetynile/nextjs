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
	Heading,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Textarea,
	useToast,
} from "@chakra-ui/react";
import axios from "axios";
import useUserStore from "@/stores/userStore";

export default function HomeContent() {
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(false);
	const user = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.setUser);
	const toast = useToast()

	useEffect(() => {
		getAllConcert();
	}, []);

	const getAllConcert = () => {
		setLoading(true);
		axios
			.get("http://localhost:55561/concert/with-reserves")
			.then((res) => {
				const converted = res.data.map((c) => ({
					id: c._id,
					title: c.title,
					description: c.description,
					ticket: c.ticket,
					reserveData: c.reserveData,
					reserveCount: c.reserveData.length,
					isEditing: false,
				}));
				setCards(converted);
			})
			.catch((err) => {
				console.error("Error fetching concerts:", err);
			});
		setLoading(false);
	}

	//count all reserveCount
	const countReserveCount = () => {
		let count = 0;
		cards.forEach((card) => {
			count += card.reserveCount;
		});
		return count;
	}

	const createNewConcert = (concert) => {
		axios
			.post("http://localhost:55561/concert", concert)
			.then((res) => {
				getAllConcert();
				toast({
					position: 'top-right',
					title: 'Concert Created.',
					description: "",
					status: 'success',
					duration: 3000,
					isClosable: true,
				})
			})
			.catch((err) => {
				const messages = err?.response?.data?.message;

				if (Array.isArray(messages)) {
					messages.forEach((msg) => {
						toast({
							position: "top-right",
							title: "Cannot Create Concert.",
							description: msg,
							status: "error",
							duration: 4000,
							isClosable: true,
						});
					});
				} else if (typeof messages === "string") {
					toast({
						position: "top-right",
						title: "Cannot Create Concert.",
						description: messages,
						status: "error",
						duration: 4000,
						isClosable: true,
					});
				} else {
					toast({
						position: "top-right",
						title: "Cannot Create Concert.",
						description: "Unexpected error occurred.",
						status: "error",
						duration: 4000,
						isClosable: true,
					});
				}
			});
	}

	const deleteConcert = (id) => {
		axios
			.delete(`http://localhost:55561/concert/${id}`)
			.then((res) => {
				getAllConcert();
				toast({
					position: 'top-right',
					title: 'Concert Deleted.',
					description: "",
					status: 'success',
					duration: 3000,
					isClosable: true,
				})
			})
			.catch((err) => {
				console.error("Error deleting concert:", err);
			});
		setIsOpen(false);
	}

	const handleCreate = () => {
		const concert = {
			title: newTitle,
			description: newDescription,
			ticket: Number(newTicket),
		};

		createNewConcert(concert);

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

	const [newTitle, setNewTitle] = useState("");
	const [newTicket, setNewTicket] = useState("");
	const [newDescription, setNewDescription] = useState("");

	const handleTitleChange = (e) => {
		setNewTitle(e.target.value);
	};

	const handleTicketChange = (e) => {
		setNewTicket(e.target.value);
	};

	const handleDescriptionChange = (e) => {
		setNewDescription(e.target.value);
	};

	const isAdmin = user && user.email === "admin@mail.com";
	const reservedConcertIds = user?.reserves?.map(r => r.concertId) || [];

	const reserveConcert = (concertId) => {
		axios
			.post(`http://localhost:55561/reserve`, { userId: user._id, concertId })
			.then(res => {
				const updatedUser = { ...user, reserves: [...user.reserves, res.data] };
				setUser(updatedUser);
				toast({
					position: 'top-right',
					title: 'Concert Reserved.',
					description: "",
					status: 'success',
					duration: 3000,
					isClosable: true,
				})
			})
			.catch(err => console.error("Error reserving concert:", err));
	};

	const cancelReserve = (concertId) => {
		const reserve = user.reserves.find(r => r.concertId === concertId);
		if (!reserve) return;
		axios
			.delete(`http://localhost:55561/reserve/`, { data: { userId: user._id, concertId } })
			.then(res => {
				const updatedUser = {
					...user,
					reserves: user.reserves.filter(r => r.userId !== user._id && r.concertId !== concertId)
				};
				setUser(updatedUser);
				toast({
					position: 'top-right',
					title: 'Concert Cancelled.',
					description: "",
					status: 'success',
					duration: 3000,
					isClosable: true,
				})
			})
			.catch(err => console.error("Error canceling reservation:", err));
	};

	const [tabIndex, setTabIndex] = useState(0);   // 0 = Overview tab

	useEffect(() => {
		if (!isAdmin) {
			setTabIndex(0);

			setCards(prev =>
				prev.map(c => ({
					...c,
					isEditing: false
				}))
			);
		}
	}, [isAdmin]);


	const startEdit = (id) => {
		setCards(cards.map(c =>
			c.id === id ? { ...c, isEditing: true } : c
		));
	};

	const cancelEdit = (id) => {
		setCards(cards.map(c =>
			c.id === id ? { ...c, isEditing: false } : c
		));
	};

	const updateEditedField = (id, field, value) => {
		setCards(cards.map(c =>
			c.id === id ? { ...c, [field]: value } : c
		));
	};

	const saveEdit = (item) => {
		const findconcert = cards.find(c => c.id === item.id);
		if (!findconcert) return;

		if (findconcert.reserveCount > Number(item.ticket)) {
			toast({
				position: 'top-right',
				title: 'Cannot update concert',
				description: 'cannot set new ticket less than existing reserve',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		axios
			.patch(`http://localhost:55561/concert/${item.id}`, {
				title: item.title,
				description: item.description,
				ticket: Number(item.ticket),
			})
			.then((res) => {
				toast({
					position: 'top-right',
					title: 'Concert Updated.',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				getAllConcert();
			})
			.catch((err) => console.error("Error updating concert:", err));
	};


	return (
		<div className={styles.homeContainer}>
			{isAdmin ? (
				<div className={styles.headSection}>
					{/* Total Card */}
					<Card
						className={styles.headSectionItem}
						backgroundColor="blue.500"
						color="white"
					>
						<i className={`bi bi-person ${styles.cardIcon}`}></i>
						<span className={styles.cardText}>
							Total of seat
						</span>
						<span>
							{sum_ticket}
						</span>
					</Card>
					{/* Reserve Card */}
					<Card
						className={styles.headSectionItem}
						backgroundColor="gray.400"
						color="white"
					>
						<i className={`bi bi-award ${styles.cardIcon}`}></i>
						<span className={styles.cardText}>
							Reserve
						</span>
						<span>
							{countReserveCount()}
						</span>
					</Card>
					{/* Cancel Card */}
					<Card
						className={styles.headSectionItem}
						backgroundColor="orange.500"
						color="white"
					>
						<i className={`bi bi-x-circle ${styles.cardIcon}`}></i>
						<span className={styles.cardText}>
							Cancel
						</span>
						<span>
							12
						</span>
					</Card>
				</div>
			) : null}

			{loading ? (<div>Loading...</div>) : null}

			<div className={styles.bodySection}>
				<Tabs isFitted index={tabIndex} onChange={setTabIndex} className={styles.tabs}>
					{isAdmin ? (
						<TabList minHeight="50px" zIndex={999}>
							<Tab>Overview</Tab>
							<Tab>Create</Tab>
						</TabList>
					) : null}

					<TabPanels className={styles.tabPanels}>
						{/* Overview */}
						<TabPanel className={styles.cardsContainer} >
							{cards.map((item, index) => (
								<Card key={index} className={styles.card}>
									<CardHeader height="3rem">
										{item.isEditing ? (
											<Input
												value={item.title}
												onChange={(e) => updateEditedField(item.id, "title", e.target.value)}
												color="blue.400"
											/>
										) : (
											<Heading size="md" color="blue.400">
												{item.title}
											</Heading>
										)}
										{item.isEditing ? null : (<hr></hr>)}

									</CardHeader>
									<CardBody>
										{item.isEditing ? (
											<Textarea
												value={item.description}
												onChange={(e) => updateEditedField(item.id, "description", e.target.value)}
											/>
										) : (
											<span>{item.description}</span>
										)}

									</CardBody>
									<CardFooter className={styles.cardFooter}>
										<span className={styles.cardFooterText}>
											<i className="bi bi-person pr-2"></i>
											{item.isEditing ? (
												<Input
													value={item.ticket}
													onChange={(e) => updateEditedField(item.id, "ticket", e.target.value)}
												/>
											) : (
												<span>{item.ticket}</span>
											)}
										</span>
										<div className={styles.cardFooterButtons}>
											{isAdmin ? (
												<>
												{item.isEditing ? (
													<>
														<Button colorScheme="blue" onClick={() => saveEdit(item)}>
															Save
														</Button>
														<Button colorScheme="gray" onClick={() => cancelEdit(item.id)}>
															Cancel
														</Button>
													</>
												) : (
													<Button colorScheme="green" onClick={() => startEdit(item.id)}>
														Edit
													</Button>
												)}
												</>
											) : null}
											

											{isAdmin ? (
												<Button
													colorScheme="red"
													onClick={() => openDeleteDialog(item.id, item.title)}
												>
													Delete
												</Button>
											) : reservedConcertIds.includes(item.id) ? (
												<Button colorScheme="orange" onClick={() => cancelReserve(item.id)}>
													Cancel
												</Button>
											) : item.reserveCount >= item.ticket ? (
												<Button colorScheme="gray" isDisabled>
													Sold Out
												</Button>
											) :
												(
													<Button colorScheme="green" onClick={() => reserveConcert(item.id)}>
														Reserve
													</Button>
												)}

										</div>
									</CardFooter>
								</Card>
							))}
						</TabPanel>
						{/* Create */}
						<TabPanel>
							<Card className={styles.card}>
								<CardHeader className={styles.createCardHeader}
									color="blue.400"
								>
									Create
									<hr></hr>
								</CardHeader>
								<CardBody paddingTop={2} className={styles.createCardBody}>
									<div className={styles.createCardBodyFirstRow}>
										<FormControl className={styles.createCardBodyFormControl}>
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
										<FormControl className={styles.createCardBodyFormControl}>
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
										<FormControl className={styles.createCardBodyFormControl}>
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
						<AlertDialogHeader className={styles.dialogHeader}>
							<i
								className="bi bi-x-circle-fill"
								style={{ color: "red" }}
							></i>
							{/* Delete Concert*/}
						</AlertDialogHeader>

						<AlertDialogBody className={styles.dialogBody}>
							<span>
								Are you confirm to delete?
							</span>
							<br />
							<span>
								"{deleteTitle}"
							</span>
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
