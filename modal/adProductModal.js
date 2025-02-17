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

    category: { type: [String], enum: ['Men', 'Women', 'Furniture','Construction Equipment ','Electronics', ' Book', 'Musical Instruments'], required: true },

    price: {
        type: Number,
        required: true
    },

    size: { type: [String], enum: ['S', 'M', 'L', 'Freeize'], required: true },

    availability: {
        type: Boolean,
        default: false,
        required: true
    },

    imgOne: {
        type: String,
        required: true
    },

    // imgTwo: {
    //     type: String,
    //     required: true
    // }


})

const products = mongoose.model("products", productSchema)
module.exports = products