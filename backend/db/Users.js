const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    mobno:String,
    Address:String
})

module.exports = mongoose.model("users", userSchema)