import React from "react"
import {Navigate, Outlet} from 'react-router-dom'

//  to check user is sign-in or not 
const PrivateComponent=()=>{
    const auth = localStorage.getItem('user')
    return auth?<Outlet/>:<Navigate to = "/login"/>
}

export default PrivateComponent