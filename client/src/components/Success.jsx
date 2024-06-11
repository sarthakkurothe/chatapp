
import { CheckCircle2 } from 'lucide-react';
import './Success.css';
import './error.css';
const Success = ({ message }) => {
	return (
		<div className="success">
			<CheckCircle2 />
			<p>{message}</p>
		</div>
	);
};

export default Success;
