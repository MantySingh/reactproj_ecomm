import React, { useState, useEffect } from 'react'

export default function Profile() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobno, setMobNo] = useState('')
    const [address, setAddress] = useState('')

    const userId = JSON.parse(localStorage.getItem('user'))._id

    useEffect(()=>{
        getUserDetails()
    }, [])

    const getUserDetails = async() =>{
        console.log('User-ID', userId)
        let result = await fetch(`http://localhost:5000/user-details/${userId}` ,{
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result = await result.json()
        console.log(result)
        setName(result.name)
        setEmail(result.email)
        setMobNo(result.mobno)
        setAddress(result.address)
    }

  return (
    <div className="product">
            <h1>User Profile</h1>
            <input type="text" className="inputBox" value={name} placeholder="Enter Name" 
                onChange={(e)=>{setName(e.target.value)}} />

            <input type="text" className="inputBox" value={email} placeholder="Enter Email" disabled= {true}
                onChange={(e)=>{setEmail(e.target.value)}} />

            <input type="text" className="inputBox" value={mobno} placeholder="Enter Contact number" 
                onChange={(e)=>{setMobNo(e.target.value)}} />

            <input type="text" className="inputBox" value={address} placeholder="Enter Address" 
                style={{"height":"70px"}}
                onChange={(e)=>{setAddress(e.target.value)}} />

            <input className="button" type="button" value="Update" />
    </div>
  )
}
