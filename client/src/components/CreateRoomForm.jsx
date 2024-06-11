import "./CreateRoomForm.css";
import { X } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Error from "./Error";
import { useState } from "react";
import { Copy } from "lucide-react";
import Success from "./Success";
import { useAppContext } from "../store/Context";
import { useNavigate } from "react-router-dom";
const CreateRoomForm = ({ setOpenCreateRoomForm }) => {
	const navigate = useNavigate();
	const {
		socket,
		roomDetails,
		setRoomDetails,
		setJoinStatus,
	} = useAppContext();

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [newRoomName, setNewRoomName] = useState("");
	const [showInviteID, setShowInviteID] = useState(false);
	const [inviteLink, setInviteLink] = useState("");
	const createRoomHandler = async (e) => {
		setError("");
		setSuccess("");
		e.preventDefault();
		if (newRoomName.length < 4) {
			setError("Room name too short!");
			return;
		}
		try {
			const ack = await new Promise((resolve, reject) => {
				socket.emit("join-room", newRoomName, (ack) => {
					resolve(ack);
				});
			});

			setJoinStatus(ack.success);
			setRoomDetails(newRoomName);

			if (ack.success) {
				setSuccess("Room created successfully!")
				setInviteLink(newRoomName);
				setShowInviteID(true);
			}
		} catch (error) {
			console.log("Error:", error);
		}
	};

	const copyInviteLink = () => {
		navigator.clipboard.writeText(inviteLink).then(
			() => {
				setSuccess("Copied to clipboard!");
			},
			(err) => {
				console.error("Failed to copy:", err);
				setError("Failed to copy to clipboard.");
			}
		);
	};

	const handleNavigate = () => {
		navigate(`/room/${roomDetails}`);
	};

	return (
		<div className="create-room-form">
			<X
				className="cut-icon"
				color="white"
				size={25}
				onClick={() => setOpenCreateRoomForm(false)}
			/>
			{!showInviteID && (
				<form className="join-form" onSubmit={createRoomHandler}>
					<input
						type="text"
						placeholder="Enter room name"
						value={newRoomName}
						onChange={(e) => setNewRoomName(e.target.value)}
					/>
					{error && <Error message={error} />}

					<button type="submit">
						Create room <ArrowRight />{" "}
					</button>
				</form>
			)}
			{showInviteID && (
				<div className="board">
					{success && <Success message={success} />}
					<p className="invite-text">Share invite link with friends</p>
					<div className="copy-wrapper">
						<input type="text" placeholder="XSGDKSB123" value={inviteLink} />
						<div className="copy-icon" onClick={copyInviteLink}>
							<Copy />
						</div>
					</div>
					<div className="chat-btn">
						<button onClick={handleNavigate}>Start chatting</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default CreateRoomForm;
