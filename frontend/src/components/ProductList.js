import React, { useEffect, useState,use } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    
    const userId = JSON.parse(localStorage.getItem('user'))._id
    const userName = JSON.parse(localStorage.getItem('user')).name
    const userEmail = JSON.parse(localStorage.getItem('user')).email

    useEffect(() => {
        getProducts()
    }, [])

    const itemsPerPage = 5; // Number of items to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index range for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentProducts = products.slice(startIndex, endIndex);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Function to handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getProducts = async () => {
        try{
            let result = await fetch('http://localhost:5000/products',{
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            })
            result = await result.json()
            setProducts(result)

            // Notoficatication message
            toast('Product details are as below', {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
                });
        }catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    console.log('Products', products)

    const deleteProduct = (id) => {
        console.log(id)

            Swal.fire({
                    title: 'Are you sure?',
                    text: 'This action cannot be undone!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                    }).then((result) => {
                    if (result.isConfirmed) 
                    {
                        let result = fetch(`http://localhost:5000/product/${id}`, {
                            method: "Delete",
                            headers: {
                                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                            }
                        })
                        result = result.json()
                        if (result) {
                            console.log(result)
                            getProducts()
                        }
                    }
            });

    }

    const searchHandle = async (e) => {
        console.log(e.target.value)
        let key = e.target.value
        if (key) {
            let result = await fetch(`http://localhost:5000/search/${key}`,{
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            })
            result = await result.json()
            if (result) {
                setProducts(result)
            }
        }
        else
        {
            getProducts()
        }
    }

    const displayRazorpay = async (amount) =>{
        try{
            console.log('Payment started', amount)

            let result = await fetch("http://localhost:5000/create-order", {
                method: 'post',
                body: JSON.stringify({amount}),
                headers: {
                    'Content-Type' : 'application/json',
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            result = await result.json()
            console.log(result)

            if(result.status === "created")
            {
                const options = {
                    key:'rzp_test_6B4tUuYtAHtvV2',
                    amount: result.amount,
                    currency: 'INR',
                    name: 'Syscraft',
                    description: 'Buy this Product',
                    image: '',
                    order_id: result.id,
                    handler: function(result){
                        const razorpay_order_id = result.razorpay_order_id
                        const razorpay_payment_id = result.razorpay_payment_id
                        const razorpay_signature = result.razorpay_signature

                        console.log("Order ID", razorpay_order_id)
                        console.log("Payment ID", razorpay_payment_id)
                        console.log("Signature", razorpay_signature)

                        let response = fetch("http://localhost:5000/verify-payment", {
                            method: 'post',
                            body: JSON.stringify({razorpay_order_id, razorpay_payment_id, razorpay_signature}),
                            headers: {
                                'Content-Type' : 'application/json',
                                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                            }
                        });
                        response.then(res=>{
                            console.log(res, '000000000000')
                            if(res.status == "200"){
                                // alert("Payment Successful")

                            //     Swal.fire({
                            //         title: 'Thanks for Purchasing.',
                            //         text: 'Your Product will be delivered soon.',
                            //         icon: 'information',
                            //         confirmButtonColor: '#3085d6',
                            //         confirmButtonText: 'Ok',
                            //         }).then((result) => {
                            //         if (result.isConfirmed) 
                            //         {
                            //             getProducts()
                            //         }
                            // });
                            // toast('Payment Successful, Order will be delivered soon')
                            toast.success('🦄 Payment Successful, Order will be delivered soon', {
                                position: "top-center",
                                autoClose: 20000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                                color: "light"
                                });
                            getProducts()
                            }
                            else
                                alert("Invalid Payment")
                        }).catch(err=>
                            alert('Error'))
                    },

                    prefill:{
                        name: userName,
                        email: userEmail,
                        contact: '',
                    },

                    notes:{
                        address:'Syscraft',
                    },
                    theme:{
                        color:'#2300a3'
                    },
                }

                // console.log(options)
                let rzp = new window.Razorpay(options)
                console.log(rzp)

                rzp.on("payment failed", function(response){
                    console.log(response.error.description)
                    alert('Oops payment failed')
                })
                rzp.open()
            }
        }
        catch(error)
        {console.log(error)}
    }

    return (
        <div className="product-list">
        <h1>Product List</h1>
        <input type="text" className="searchBox" placeholder="Search"
            data-toggle="tooltip" data-placement="top" title="Enter text to Search"
            onChange={searchHandle} />
        
        <table>
            <thead>
                <tr>
                    <th>S. No.</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Company</th>
                    <th>Operation</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {currentProducts.length > 0 ? (
                    currentProducts.map((item, index) => (
                        <tr key={item._id}>
                            <td>{startIndex + index + 1}</td>
                            <td>{item.pname}</td>
                            <td>{item.pprice}</td>
                            <td>{item.pcategory}</td>
                            <td>{item.pcompany}</td>
                            <td>
                                <Link className="btn btn-secondary" to={`/update/${item._id}`}>
                                    Update
                                </Link>
                                &nbsp;&nbsp;
                                <button className="btn btn-secondary"
                                    onClick={() => deleteProduct(item._id)} >
                                    Delete
                                </button>
                            </td>
                            <td>
                                <button className="btn btn-secondary"
                                    onClick={() => displayRazorpay(item.pprice)} >
                                    Buy Now
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7">No products available</td>
                    </tr>
                )}
            </tbody>
        </table>

        <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={currentPage === i + 1 ? 'active' : ''}
                >
                    {i + 1}
                </button>
            ))}
        </div>

        {/* <table class="table table-striped">
            <thead class="thead-dark">
                <tr>
                    <th>S. No.</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Company</th>
                    <th>Operation</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? (
                    products.map((item, index) => (
                        <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{item.pname}</td>
                            <td>{item.pprice}</td>
                            <td>{item.pcategory}</td>
                            <td>{item.pcompany}</td>
                            <td>
                                <Link className="btn btn-secondary" data-toggle="tooltip"  
                                title="Click here to Update" data-placement="top"
                                 to={"/update/" + item._id}>Update</Link> &nbsp;&nbsp;
                                <button className="btn btn-secondary" data-toggle="tooltip"  
                                title="Click to Delete"
                                 onClick={() => deleteProduct(item._id)}>Delete</button>
                            </td>
                            <td>
                                <button className="btn btn-secondary" data-toggle="tooltip"  
                                title="Click here to Buy"
                                onClick={() => displayRazorpay(item.pprice)}>Buy Now</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7">No products available</td>
                    </tr>
                )}
            </tbody>
        </table>        */}

        <ToastContainer/>
         {/* position="top-right" autoClose={50000} hideProgressBar={false} newestOnTop={false}
            closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" /> */}
    
        </div>
    )
}

export default ProductList