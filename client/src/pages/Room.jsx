/** @format */

import "./room.css";
import { useEffect, useState, useRef, useMemo } from "react";
import { useAppContext } from "../store/Context";
import { useNavigate } from "react-router-dom";
import { SendHorizontal } from "lucide-react";
import { Meh } from "lucide-react";
import User from "../components/User";
import toast from "react-hot-toast";
import Picker from "emoji-picker-react";

const Room = () => {
	const navigate = useNavigate();
	const {
		socket,
		roomDetails,
		setRoomDetails,
		joinStatus,
		setJoinStatus,
		allMessages,
		setAllMessages,
		allRoomUsers,
		setAllRoomUsers,
	} = useAppContext();
	const messageContainerRef = useRef();
	const [message, setMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const handleEmojiPickerHideShow = () => {
		setShowEmojiPicker((prev) => !prev);
	};

	const handleEmojiClick = (emojiData, event) => {
		let newMessage = message;
		newMessage += emojiData.emoji;
		setMessage(newMessage);
	};

	useEffect(() => {
		messageContainerRef.current.scrollTop =
			messageContainerRef.current.scrollHeight;
	}, [allMessages]);

	useEffect(() => {
		if (joinStatus === null) {
			navigate("/");
		}
	}, [joinStatus, navigate]);

	useEffect(() => {
		socket.on("userJoined", (message) => {
			toast.success(message);
			if (!allRoomUsers.includes(message)) {
				setAllRoomUsers((prev) => [...prev, message]);
				console.log(allRoomUsers);
			}
			const newData = {
				msg: message,
				by: "notification",
			};
			setAllMessages((prev) => [...prev, newData]);
		});

		socket.on("userLeft", (message) => {
			console.log(message);
			toast.error(message);
		});

		socket.on("newMessage", ({ message, senderID }) => {
			console.log("Senderid ", senderID);
			if (senderID === socket.id) {
				const newData = {
					msg: message,
					by: "self",
				};
				setAllMessages((prev) => [...prev, newData]);
				console.log("setall messages ", allMessages);
			} else {
				const newData = {
					msg: message,
					by: "other",
				};
				setAllMessages((prev) => [...prev, newData]);
				console.log("allmessages ", allMessages);
			}
		});

		socket.on("disconnect", () => {
			console.log("Disconnected from server");
		});

		return () => {
			socket.off("newMessage");
		};
	}, []);

	const memoizedUsers = useMemo(
		() => allRoomUsers.map((user, key) => <User key={key} user={user} />),
		[allRoomUsers]
	);

	const sendMessageHandler = async () => {
		try {
			if (message.length !== 0) {
				socket.emit("sendMessage", { message, roomDetails });
				setShowEmojiPicker(false);
			}
			setMessage("");
		} catch (error) {
			console.log("Error while sending the message");
		}
	};

	return (
		<div className="room-page">
			<div className="sidebar">
				<p className="room-title">User inside this room</p>
				<div className="all-users">{memoizedUsers}</div>
			</div>
			<div className="chat-area">
				<div className="header">
					<img
						src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.87170709.1707868800&semt=ais"
						alt=""
					/>
					<div className="h-details">
						<h6 className="user-id">{socket.id}</h6>
						<p>{roomDetails}</p>
					</div>
				</div>
				<div className="chat-screen" ref={messageContainerRef}>
					{allMessages.map((message, key) => {
						if (message.by === "self") {
							return (
								<p className="self" key={key}>
									{message.msg}
								</p>
							);
						} else if (message.by === "notification") {
							return (
								<p className="notification" key={key}>
									{message.msg}
								</p>
							);
						} else {
							return (
								<p className="other" key={key}>
									{message.msg}
								</p>
							);
						}
					})}
				</div>
				<div className="send-area">
					<div className="emoji">
						<Meh onClick={handleEmojiPickerHideShow} />
						{showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}  height={400} width={300} style={{position:"absolute" , top:"-400px", left:0}}
						/>}
					</div>
					<input
						type="text"
						placeholder="Enter new message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button className="send-btn" onClick={sendMessageHandler}>
						<SendHorizontal />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Room;
