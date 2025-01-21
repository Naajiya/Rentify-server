const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    size: {
        S: { type: Boolean, default: false },
        M: { type: Boolean, default: false },
        L: { type: Boolean, default: false }
    },

    imgOne: {
        type: String,
        required: true
    },

    imgTwo: {
        type: String,
        required: true
    }


})

const products = mongoose.model("products", productSchema)
module.exports = products