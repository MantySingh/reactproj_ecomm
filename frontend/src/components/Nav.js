import React from "react";
import { Link, useNavigate } from "react-router-dom";


const Nav=()=>{   
    const auth = localStorage.getItem('user');
    const navigate = useNavigate();

const logout=()=>{
    localStorage.clear();
    navigate('/login');

    // For Google Logout
    window.open(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        '_self'
    )
}

    return(
        <div>
            {/* <img src="../" alt="logo" className="logo"></img> */}
            <img src="./logo192.png" alt="hello" className="logo"></img>
            {   auth ? <ul className="nav-ul">
                    <li><Link to="/" >Products</Link></li>
                    <li><Link to="/add" >Add Products</Link></li>
                    {/* <li><Link to="/update" >Update Product</Link></li> */}
                    <li></li>
                    <li><Link to="/profile" >Profile</Link></li>
                    <li><Link onClick={logout} to="/login" >Logout [Hello {JSON.parse(auth).name}]</Link></li>
                </ul>
                :
                <ul className="nav-ul ">
                    <li><Link to="/login" >Login</Link></li>
                    {/* <li><Link to="/signup" >Sign Up</Link></li> */}
                </ul>
            }
        </div>
    )
}

export default Nav