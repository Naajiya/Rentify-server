const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      },
      days: {
        type: Number,
        default: 1
      },
      size: {
        type: String
      },
      total: {
        type: Number
      },
      startingDate:{
        type:Date
      },
      endingDate:{
        type:Date
      }
    }
  ],

  address: [
    {
      name: { type: String, required: true },
      phone: { type: Number, required: true },
      pincode: { type: Number, required: true },
      addresses: { type: String, required: true },
      date: { type: Date, required: true },
      city: { type: String, required: true },
      aadharNumber: { type: String, unique: false },
      digSign: { type: String},
      acceptPolicy: {
        type: Boolean,
        default: false,
        required: true
      }
    },
  ],

  // Save the address used for this order. You may allow the user to select an address from their address list.

  status: {
    type: String,
    default: 'Pending' // You can have statuses such as 'Pending', 'Confirmed', 'Delivered', etc.
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const orders = mongoose.model('Order', orderSchema);
module.exports = orders;