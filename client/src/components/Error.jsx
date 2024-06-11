import { AlertTriangle } from "lucide-react";
import './error.css';
const Error = ({ message }) => {
	return (
		<div className="error">
			<AlertTriangle />
			<p>{message}</p>
		</div>
	);
};

export default Error;
