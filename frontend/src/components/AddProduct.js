import React, { useState, use } from "react";
import { useNavigate } from 'react-router-dom'

const AddProduct=()=>{
    const [pname, setPname] = useState('')
    const [pprice, setPprice] = useState('')
    const [pcategory, setPcategory] = useState('')
    const [pcompany, setPcompany] = useState('')
    const [error, setError] = useState('')
    const [file, setFile] = useState();
    const [attachedfile, setAttachedfile] = useState()
    const [attachedFilename, setAttachedFilename] = useState()

    const navigate = useNavigate()

    // Validation with error message in SPAN
    const addProduct = async () =>{

        if(!pname || !pprice || !pcategory || !pcompany)
        {
            setError(true)
            return false
        }

        try{
            handleFileUpload()

            console.log(pname, pprice, pcategory, pcompany, attachedFilename);
            const userId = JSON.parse(localStorage.getItem('user'))._id
            console.log(userId)

            let result = await fetch("http://localhost:5000/add-product", {
                method: 'post',
                body: JSON.stringify({pname, pprice, pcategory, pcompany, attachedFilename, userId}),
                headers: {
                    'Content-Type' : 'application/json',
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            result = await result.json()
            console.log(result)
            if(result._id)
            {
                navigate("/")
            }
        }
        catch(err){
            alert('Server error, Please try again.')
        }
    }

    const handleFileUpload = () => {
        const formData = new FormData();
        formData.append('file', attachedfile);
    
        fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        })
            .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });
      };

    function handleChange(e) {
        setAttachedFilename(e.target.files[0].name)
        setAttachedfile(e.target.files[0])

        console.log('1', e.target.files)
        console.log('2', e.target.files[0])

        setFile(URL.createObjectURL(e.target.files[0]));
    }

    return(
        <div className="product">
            <div>
                <h1>Add Product</h1>
                <input type="text" className="inputBox" value={pname} placeholder="Enter Product Name" 
                    onChange={(e)=>{setPname(e.target.value)}} />
                {error && !pname && <span className="errormsg">Enter Product Name</span>}

                <input type="text" className="inputBox" value={pprice} placeholder="Enter Product Price" 
                    onChange={(e)=>{setPprice(e.target.value)}} />
                {error && !pprice && <span className="errormsg">Enter Product Price</span>}

                <input type="text" className="inputBox" value={pcategory} placeholder="Enter Product Category" 
                    onChange={(e)=>{setPcategory(e.target.value)}} />
                {error && !pcategory && <span className="errormsg">Enter Product Category</span>}

                <input type="text" className="inputBox" value={pcompany} placeholder="Enter Product Company" 
                    onChange={(e)=>{setPcompany(e.target.value)}} />
                {error && !pcompany && <span className="errormsg">Enter Product Company Name</span>}

                <input type="file" className="inputBox" id="fileInput" placeholder="Select file/Image"
                    onChange={handleChange} />

                <input className="button" type="button" onClick={addProduct} value="Add Product" />
            </div>
            <div>
                <img src={file} alt="Doc" />
            </div>
        </div>
    )
}

export default AddProduct