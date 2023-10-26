const express = require("express")
const multer = require('multer')
const cors = require("cors")
require('./db/config')
const User = require("./db/Users")
const Product = require("./db/Product")
const Payment = require("./db/Payment")
const Jwt = require('jsonwebtoken')
const jwtkey = 'e-comm'
const Razorpay = require('razorpay')
const app = express()
const crypto = require('crypto');
const GoogleStrategy = require('passport-google-oauth20').Strategy
// const passport = require('passport')
const passportSetup = require('passport')
const authRoute = require('./routes/auth')

app.use(express.json())     //to fetch the payload data i.e. from postman or front-end
app.use(cors())

// app.use(express.static('uploads'));
// app.use(
//     cookieSession({
//         name: "session",
//         keys: ['syscraft'],
//         maxAge: 24*60*60*100,
//     })
// )

// app.use('/auth', authRoute)

// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://www.example.com/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ))

function randomString(size = 10) {  
    return crypto
      .randomBytes(size)
      .toString('base64')
      .slice(0, size)
}

app.post("/create-order", async (req,resp)=>{
    try{
    let amount = req.body.amount
    // resp.json(amount)
    const razorpay = new Razorpay({key_id: 'rzp_test_6B4tUuYtAHtvV2', 
                                key_secret: 'zTBm2Xv444rNPfXIvOWR1Lr9'})

    // amount = amount * 100
    const ob = {
                amount: amount * 100,
                currency: "INR",
                receipt: randomString()
            }
    
    const order = await razorpay.orders.create(ob, (err, order) =>{
            if(!err)
                resp.json(order)
            else
                resp.json(err)
        })    
    } 
    catch(error)
    {
        console.log(error)
    }
})

app.post('/verify-payment', async (req, res) => {
    const body = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  
    // Verify the Razorpay payment signature
    
    const expectedSignature = crypto
      .createHmac('sha256', 'zTBm2Xv444rNPfXIvOWR1Lr9')
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
  
      const isAuthentic = expectedSignature === razorpay_signature
    if (isAuthentic) {

        let payment = new Payment(req.body);
        let result = await payment.save();

        res.send({result: 'Payment Successful'});
    } 
    else {
        res.send({result: 'Payment Failed'});
    }
  });

//  request coming from front-end to sign-up new user
app.post("/register", verifyToken,async (req,resp)=>{
    let user = new User(req.body)
    let result = await user.save()
    result = result.toObject();
    delete result.password;
    //resp.send(result)
    Jwt.sign({ result }, jwtkey, { expiresIn: "2H" }, (err, token) => {
        if (err) {
            resp.send({ result: "Something went wrong, Please try after sometime." })
        }
        resp.send({ result, auth: token })
    })
})

//  login user request from front-end
app.post('/login',  async (req,resp)=>{
    try {
        if (req.body.email && req.body.password) {        //  to check email & password both are coming from front-end
            let user = await User.findOne(req.body).select("-password")
            if (user) {
                // to bind json-web-token on login
                // Jwt.sign({ user }, jwtkey, { expiresIn: "2H" }, (err, token) => {
                Jwt.sign({ user }, jwtkey, (err, token) => {
                    if (err) {
                        resp.send({ result: "Something went wrong, Please try after sometime." })
                    }
                    resp.send({ user, auth: token })
                })
            }
            else {
                resp.send({ result: "No user found" })
            }
        }
        else {
            resp.send({ result: "No user found" })
        }
    }
    catch (err) {
            console.log(err)
        }
})

// fetch user details
app.get("/user-details/:id", async (req,resp)=>{
    let result = await User.findOne({_id: req.params.id})
    if(result){
        resp.send(result)
    }
    else{
        resp.send({result:"No record found"})
    }
})

// update product details
app.put("/update-user/:id", verifyToken, async (req,resp)=>{
    let result = await User.updateOne(
        {_id: req.params.id},
        {
            $set : req.body
        }
    )
    resp.send(result)
})

// Add product
app.post("/add-product", verifyToken, async (req, resp)=>{
    let product = new Product(req.body);
    console.log("products: ", product)
    let result = await product.save();
    resp.send(result)
})

// to upload an image or a text to a particular folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, resp) => {
        resp.status(200).send('File uploaded successfully');
})

// product list
app.get("/products", verifyToken, async (req, resp) =>{
    let products = await Product.find()
    if(products.length>0){
        resp.send(products)
    }
    else
    {
        resp.send({result:"No product found"})
    }
})

// Delete product
app.delete("/product/:id", verifyToken, async (req,resp)=>{
    const result = await Product.deleteOne({_id: req.params.id})
    resp.send(result)
})
// fetch data to update the product details
app.get("/product/:id", async (req,resp)=>{
    let result = await Product.findOne({_id: req.params.id})
    if(result){
        resp.send(result)
    }
    else{
        resp.send({result:"No record found"})
    }
})

// update product details
app.put("/product/:id", verifyToken, async (req,resp)=>{
    let result = await Product.updateOne(
        {_id: req.params.id},
        {
            $set : req.body
        }
    )
    resp.send(result)
})

// Search product api
app.get("/search/:key",  async (req,resp)=>{
    const searchKey = req.params.key
    let result = await Product.find({
        "$or":[
            {pname:     {$regex: searchKey, $options: "i"}},
            {pcompany:  {$regex: searchKey, $options: "i"}},
            {pcategory: {$regex: searchKey, $options: "i"}}
        ]
    })
    resp.send(result)
})

function verifyToken(req, resp, next){
    let token = req.headers['authorization']
    const expiresIn = '1m'; // 1 minute expiration

    if(token){
        token = token.split(' ')[1]
        console.log("middleware called", token)
        // Jwt.verify(token, jwtkey, { expiresIn }, (err, valid)=>{
        Jwt.verify(token, jwtkey, (err, decoded)=>{
            if(err){
                resp.status(401).send({result: "Please provide valid token"})
            }
            else{
                next()
            }
        })
    }
    else{
        resp.status(403).send({result: "Please add token with header"})
    }
}

app.listen(5000)