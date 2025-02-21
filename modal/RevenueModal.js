const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
    products: [
        {
            productId: {
                type: String, // Ensure productId is stored as a String
                // required: true,
            },
            count: {
                type: Number,
                default: 0,
            },
            category: {
                type: String,
                required: true,
            },
            total: {
                type: Number,
                default: 0,
            },

        },
    ],
    grandTotal: {
        type: Number,
        default: 0,
    },
    expense: [
        {
            expenseCost: {
                type: Number
            },
            description: {
                type: String
            }
        }
    ],
    totalExpense:{
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Revenues = mongoose.model('Revenues', revenueSchema);
module.exports = Revenues;