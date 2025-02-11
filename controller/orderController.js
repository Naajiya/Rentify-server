const users = require('../modal/userModal')
const products = require('../modal/adProductModal')
const orders = require('../modal/orderModal')


exports.createOrder = async (req, res) => {
  const userId = req.userId; // Assuming userId is available in the request
  const { selectedAddressId, items } = req.body; // selectedAddressId is the _id of the address in the user's address array

  try {
      // Find the user
      const user = await users.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Get the selected address from the user's address array
      const selectedAddress = user.address.find(addr => addr._id.toString() === selectedAddressId);
      console.log(selectedAddress);

      if (!selectedAddress) {
          return res.status(400).json({ message: 'Invalid address ID' });
      }

      // Get the starting date of delivery from the selected address
      const startingDate = new Date(selectedAddress.startingDate);

      // Map through items and calculate the ending date for each product
      const orderItems = items.map(item => {
          const endingDate = new Date(startingDate);
          endingDate.setDate(endingDate.getDate() + item.days); // Add the number of days to the starting date

          return {
              product: item.productId._id, // Ensure only the product ID is used
              quantity: item.quantity,
              days: item.days,
              size: item.size,
              total: item.total,
              startingDate: startingDate, // Include the starting date
              endingDate: endingDate // Include the calculated ending date
          };
      });

      // Create a new order
      const newOrder = new orders({
          user: userId,
          items: orderItems, // Include items with starting and ending dates
          address: selectedAddress, // Store the selected address directly
          status: 'Booked', // Default status
          createdAt: new Date()
      });

      // Save the order
      await newOrder.save();

      // Clear the user's cart
      user.cart = [];
      await user.save();

      res.status(200).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
};



exports.getUserOrder = async (req, res) => {
    console.log('inside getUserOrder');
    const userId = req.userId;

    try {
        // Find all orders for the specific user
        const userOrders = await orders.find({ user: userId }).populate('items.product');

        if (!userOrders || userOrders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        // Return the orders
        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders: userOrders
        });

    } catch (err) {
        console.error('Error fetching user orders:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAllOrders = async (req, res) => {
    console.log('inside getAllOrders');

    try {
        // Fetch all orders from the database and populate the product details
        const allOrders = await orders.find().populate('user', 'username email').populate('items.product');

        if (!allOrders || allOrders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        // Return the orders
        res.status(200).json({
            message: 'All orders retrieved successfully',
            orders: allOrders
        });

    } catch (err) {
        console.error('Error fetching all orders:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};