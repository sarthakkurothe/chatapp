/** @format */

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import {Toaster} from "react-hot-toast";
const App = () => {
	return (
		<div className="layout">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/room/:id" element={<Room />} />
				</Routes>
			</BrowserRouter>
			<Toaster/>
		</div>
	);
};

export default App;
