import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../../../firebase'
import { AuthContext } from '../../../context/AuthContext'

const Navbar = () => {
  const {currentUser} = useContext(AuthContext)
  console.log(currentUser.firstName);
  return (
    <div className='navbar'>
      <span className="logo">FriendSpace</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.firstName}</span>
        <button onClick={()=>signOut(auth)}>logout</button>
      </div>
    </div>
  )
}

export default Navbar