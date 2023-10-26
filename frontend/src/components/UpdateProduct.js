import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom'

const UpdateProduct=()=>{
    const [pname, setPname] = useState('')
    const [pprice, setPprice] = useState('')
    const [pcategory, setPcategory] = useState('')
    const [pcompany, setPcompany] = useState('')
    const [error, setError] = useState('')
    const [attachedFilename, setattachedFilename] = useState('')
    const params = useParams()
    const navigate = useNavigate()

    useEffect(()=>{
        getProductDetails()
    }, [])

    // fetch the details with id
    const getProductDetails = async() =>{
        console.log(params)
        let result = await fetch(`http://localhost:5000/product/${params.id}`,{
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result = await result.json()
        console.log(result)
        setPname(result.pname)
        setPprice(result.pprice)
        setPcategory(result.pcategory)
        setPcompany(result.pcompany)
        setattachedFilename(result.attachedFilename)
    }

    // Validation with error message in SPAN
    const updateProduct = async () =>{
        // if(!pname || !pprice || !pcategory || !pcompany)
        // {
        //     setError(true)
        //     return false
        // }

        console.log(pname, pprice, pcategory, pcompany);
        // const userId = JSON.parse(localStorage.getItem('user'))._id
        // console.log(userId)

        let result = await fetch(`http://localhost:5000/product/${params.id}`, {
            method: 'Put',
            body: JSON.stringify({pname, pprice, pcategory, pcompany}),
            headers: {
                'Content-Type' : 'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json()
        console.log(result)
        navigate("/")
    }

    return(
        <div className="product">
            <h1>Update Product</h1>
            <input type="text" className="inputBox" value={pname} placeholder="Enter Product Name" 
                onChange={(e)=>{setPname(e.target.value)}} />
            {/* {error && !pname && <span className="errormsg">Eneter Product Name</span>} */}

            <input type="text" className="inputBox" value={pprice} placeholder="Enter Product Price" 
                onChange={(e)=>{setPprice(e.target.value)}} />
            {/* {error && !pprice && <span className="errormsg">Eneter Product Price</span>} */}

            <input type="text" className="inputBox" value={pcategory} placeholder="Enter Product Category" 
                onChange={(e)=>{setPcategory(e.target.value)}} />
            {/* {error && !pcategory && <span className="errormsg">Eneter Product Category</span>} */}

            <input type="text" className="inputBox" value={pcompany} placeholder="Enter Product Company" 
                onChange={(e)=>{setPcompany(e.target.value)}} />
            {/* {error && !pcompany && <span className="errormsg">Eneter Product Company Name</span>} */}

            <input type="label" className="inputBox" value={attachedFilename} disabled={true} />

            <input className="button" type="button" onClick={updateProduct} value="Update Product" />
        </div>
    )
}

export default UpdateProduct