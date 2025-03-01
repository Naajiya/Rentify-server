const users = require('../modal/userModal')
const products = require('../modal/adProductModal')
const orders = require('../modal/orderModal');
const revenues = require('../modal/RevenueModal');


exports.createOrder = async (req, res) => {
    console.log('inside order');
    const userId = req.userId; // Assuming userId is available in the request
    const { selectedAddressId, items, paymentMethod } = req.body;

    try {
        // Find the user
        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get the selected address from the user's address array
        const selectedAddress = user.address.find(addr => addr._id.toString() === selectedAddressId);
        if (!selectedAddress) {
            return res.status(400).json({ message: 'Invalid address ID' });
        }

        // Validate startingDate
        const dateString = selectedAddress.date;
        const startingDate = new Date(dateString);
        if (isNaN(startingDate.getTime())) {
            return res.status(400).json({ message: 'Invalid starting date in the selected address' });
        }

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
                endingDate: endingDate, // Include the calculated ending date
            };
        });

        // Calculate the grandTotal by summing up the total of all items
        const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

        // Create a new order
        const newOrder = new orders({
            user: userId,
            paymentMethod,
            items: orderItems,
            address: selectedAddress,
            status: 'Booked',
            createdAt: new Date(),
        });

        // Save the order
        await newOrder.save();

        // Clear the user's cart
        user.cart = [];
        await user.save();

        // Prepare product details for revenue calculation
        const prodDetls = items.map(item => ({
            productId: item.productId._id.toString(), // Ensure productId is a String
            category: item.productId.category[0], // Use the first category
            total: item.total,
        }));

        // Find the existing revenue document
        let existingRevenue = await revenues.findOne({});

        if (existingRevenue) {
            // Update existing products and grandTotal
            prodDetls.forEach(newProduct => {
                const existingProduct = existingRevenue.products.find(
                    prod => prod.productId === newProduct.productId // Compare as Strings
                );

                if (existingProduct) {
                    // If the product exists, update its total
                    existingProduct.total += newProduct.total;
                    existingProduct.count = (existingProduct.count || 0) + 1;
                } else {
                    // If the product doesn't exist, add it to the products array
                    newProduct.count = 1;
                    existingRevenue.products.push(newProduct);
                }
            });

            // Update the grandTotal
            existingRevenue.grandTotal += grandTotal;

            // Save the updated revenue document
            await existingRevenue.save();
        } else {
            // If no existing revenue document is found, create a new one
            const newRevnu = new revenues({
                products: prodDetls,
                grandTotal: grandTotal,

                date: new Date(),
            });

            await newRevnu.save();
        }

        res.status(200).json({ message: 'Order created successfully', order: newOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updateStatus = async (req, res) => {
    console.log('inside update status')

    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await orders.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: 'order not found' })
        }

        order.status = status

        await order.save()

        res.status(200).json({ message: 'order status updated', order })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'internal server error' })
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

        allOrders.sort((a, b) => {
            const dateA = new Date(a.items[0].startingDate);
            const dateB = new Date(b.items[0].startingDate);
            return dateA - dateB;
        })

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