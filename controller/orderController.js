const users = require('../modal/userModal')
const products = require('../modal/adProductModal')
const orders = require('../modal/orderModal')


exports.createOrder = async (req, res) => {
    console.log('inside order');

    const userId = req.userId

    try {
        const user = await users.findById(userId).populate('cart.productId');

        if (!user) {

            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: 'No items in the cart' });
        }

        const orderItems = user.cart.map(item => ({
            product: item.productId._id,
            quantity: item.quantity,
            days: item.days,
            size: item.size,
            total: item.total
        }))

        const newOrder = new orders({
            user: userId,
            items: orderItems,
            status: 'pending'
        })

        await newOrder.save()

        user.cart = [];
        await user.save();

        res.status(201).json({
            message: 'Order placed successfully',
            order: newOrder
        });


    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

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