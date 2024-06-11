/** @format */

import { createContext, useContext, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../utils/data";

const AppContext = createContext();

const AppProvider = ({ children }) => {
	const socket = useMemo(() => {
		try {
			return io(SOCKET_URL);
		} catch (error) {
			console.error("Error connecting to socket:", error);
			return null;
		}
	}, [SOCKET_URL]);

	const [allMessages, setAllMessages] = useState([]);
	const [roomDetails, setRoomDetails] = useState();
	const [userDetails, setUserDetails] = useState();
	const [socketID, setSocketID] = useState(socket.id);
	const [joinStatus, setJoinStatus] = useState(null);
	const [allRoomUsers, setAllRoomUsers] = useState([]);

	return (
		<AppContext.Provider
			value={{
				socket,
				allMessages,
				setAllMessages,
				roomDetails,
				setRoomDetails,
				userDetails,
				setUserDetails,
				socketID,
				joinStatus,
				setJoinStatus,
				allRoomUsers,
				setAllRoomUsers,
			}}>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within an app provider");
	}
	return context;
};

export { AppContext, AppProvider, useAppContext };
