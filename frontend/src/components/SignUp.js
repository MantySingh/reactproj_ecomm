import React, {useState, useEffect} from "react";
import {Navigate, useNavigate, Link} from 'react-router-dom'

const SignUp =()=>{
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [confpassword, setConfPassword]=useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        const auth = localStorage.getItem('user')
        if(auth)
        {
            navigate('/')
        }
    })

    const collectData = async ()=>{
        console.log(name, email, password, confpassword)
        let result = await fetch('http://localhost:5000/register',{
            method:'post',
            body:JSON.stringify({name,email,password}),
            headers:{
                'Content-Type':'application/json'
            },
        });
        result = await result.json()
        localStorage.setItem("user", JSON.stringify(result.result))
        localStorage.setItem("token", JSON.stringify(result.auth))
        console.log(result)

        if(result)
        {
            navigate('/')
        }
    }

    return(
        <div className="register">
            <h1>Register here</h1>
            <input className="inputBox" type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter Name"/>
            <input className="inputBox" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email"/>
            <input className="inputBox" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password"/>
            <input className="inputBox" type="password" value={confpassword} onChange={(e)=>setConfPassword(e.target.value)} placeholder="Confirm Password"/>
            <input className="button" type="button" onClick={collectData} value="Sign Up"/>
            Existing User? <Link to="/login" >Login</Link>
        </div>
    )
}

export default SignUp