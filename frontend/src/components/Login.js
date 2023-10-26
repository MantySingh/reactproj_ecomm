import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import google from '../images/google.png'
import facebook from '../images/facebook.png'
// import Flash from 'react-flash-message';

const Login = ()=>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState(null)

    useEffect(()=>{
        const auth = localStorage.getItem('user')
        if(auth)
            navigate('/')

            //getUser()
    })

    const getUser = async () => {
        try{
            const url = `${process.env.REACT_APP_API_URL}/auth/login/success`
            const {data} = await fetch(url, {withCredentials: true})
            setUser(data.user.json)
        } catch(err){
            console.log(err)
        }
    }

    const handleLogin = async ()=>{
        console.log(email,password);
        let result = await fetch('http://localhost:5000/login',{
            method: 'post',
            body: JSON.stringify({email, password}),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        result = await result.json();
        console.log("Login Credentials", result);

        if(result.auth){
            localStorage.setItem("user", JSON.stringify(result.user))
            localStorage.setItem("token", JSON.stringify(result.auth))
            navigate('/')
        }
        else{
            alert('Please enter correct details')
        }
    }

    const googleAuth = () =>{
        window.open(
            `${process.env.REACT_APP_API_URL}/auth/google/callback`,
            '_self'
        )        
    }

    return(
        <div className="login">
            <h1>Login Page</h1>
            <input className="inputBox" type="text" value={email} placeholder="Enter Email" onChange={(e)=>setEmail(e.target.value)} />
            <input className="inputBox" type="password" value={password} placeholder="Enter Password" onChange={(e)=>setPassword(e.target.value)} />

            <input className="button" type="button" onClick={handleLogin} value="Login" />
            New User? <Link to="/signup" >Sign Up</Link>

            {/* <div className="or">OR</div> */}
            
            {/* <div className="loginButton">
                <button onClick={googleAuth}>
                    <img src={google} alt='' className="icon" />
                </button>
                <img src={facebook} alt='' className="icon" /> 
            </div> */}
        </div>
    )
}

export default Login