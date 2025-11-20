"use client";

import styles from "./component.module.css";
import { Button } from "@chakra-ui/react";
import { useState, useRef } from "react";
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

export default function HomeContent() {
	// init cards
	const initialCards = [
		{
			id: "1",
			title: "Card 1",
			detail:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
			ticket: "300",
		},
		{
			id: "2",
			title: "Card 2",
			detail:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
			ticket: "250",
		},
		{
			id: "3",
			title: "Card 3",
			detail:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
			ticket: "250",
		},
	];

	//cards array state
	const [cards, setCards] = useState(initialCards);

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
	const [newDetail, setNewDetail] = useState("");

	const handleTitleChange = (e) => {
		setNewTitle(e.target.value);
		// console.log("Title:", e.target.value);
	};

	const handleTicketChange = (e) => {
		setNewTicket(e.target.value);
		// console.log("Total Seats:", e.target.value);
	};

	const handleDetailChange = (e) => {
		setNewDetail(e.target.value);
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
										<Text>{item.detail}</Text>
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
												value={newDetail}
												onChange={handleDetailChange}
												required
											/>
										</FormControl>
									</div>
								</CardBody>
								<CardFooter justify="end" paddingTop={0}>
									<Button colorScheme="blue" paddingInline={8}>
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
								class="bi bi-x-circle-fill"
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
								onClick={confirmDelete}
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
