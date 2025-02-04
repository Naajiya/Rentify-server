// models/Order.js
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
      }
    }
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
