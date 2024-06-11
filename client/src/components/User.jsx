import './user.css';
import trophy from '../assets/icon.gif'
const User = ({user}) => {
  console.log("user is ", user)
  return (
    <div className='user-card'>
        <img src={trophy} alt="" />
        <p>{user}</p>
    </div>
  )
}

export default User