const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    pname: String,
    pprice: String,
    pcategory: String,
    pcompany: String,
    attachedFilename: String,
    userId: String,    
})


module.exports = mongoose.model("products", productSchema)