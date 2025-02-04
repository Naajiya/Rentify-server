const users = require('../modal/userModal')
const jwt = require('jsonwebtoken')
    const products = require('../modal/adProductModal')

// register
exports.userRegister = async (req, res) => {

    console.log("inside register Controller")

    const { username, email, password } = req.body;
    // console.log(username, email, password);
    // res.status(200).json("requuest sent successfully");

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {

            res.status(406).json("Account already exist... please login")
        } else {
            const newUser = new users({ username, email, password })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (err) {
        res.status(401).json(err)

    }
}



// login
exports.userLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await users.findOne({ email, password })
        if (existingUser) {
            const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_PASSWORD)
            res.status(200).json({ user: existingUser, token })
            
        } else {
            res.status(404).json("invalid username or password")

        }
    } catch (err) {
        console.log(err)
    }
}


exports.viewProduct = async (req, res) => {
    const { proId } = req.params;
    try {
        // Fetch the product using findOne (assuming proId is unique)
        const productDetails = await products.findOne({ _id: proId });
        // console.log(productDetails);

        if (productDetails) {
            res.status(200).json(productDetails);
        } else {
            res.status(404).json({ message: "Product not available" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching the product details" });
    }
};



exports.addToCart = async (req, res) => {
    const { productId, quantity, days, size } = req.body;
    const userId = req.userId;

    try {
        // Find the user and product
        const user = await users.findById(userId);
        const product = await products.findById(productId);

        if (!user || !product) {
            return res.status(404).json({ message: 'User or Product not found' });
        }

        // Check if the product already exists in the user's cart
        const cartItem = user.cart.find(item => item.productId.toString() === productId && item.size === size);

        if (cartItem) {
            // If the same product with the same size exists, increase the quantity and days
            cartItem.quantity += quantity;
            // cartItem.days += days;
            cartItem.total = cartItem.quantity * product.price * cartItem.days;
        } else {
            // If the product does not exist in the cart or has a different size, add it as a new item
            const total = quantity * product.price * days;
            user.cart.push({ productId, quantity, days, size, total });
        }

        await user.save();

        // Send response
        res.status(200).json({ message: 'Product added/updated in cart successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getCarts=async(req,res)=>{
    console.log("inside getCarts");

    const userId = req.userId
    console.log(userId)
    try{
        const userCart = await users.findOne({_id:userId}).populate("cart.productId")
        console.log(userCart)
        
        res.status(200).json(userCart)
    }catch(err){
        console.log(err)
        res.status(401).json(err)
    }
}

exports.editCarts = async (req, res) => {
    const { carId } = req.params; // Use cartId instead of carId for clarity
    const { quantity, days } = req.body;
    const userId = req.userId;

    console.log('Inside editCarts:', { userId, carId, quantity, days });

    try {
        // Find the user and the specific cart item
        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cartItem = user.cart.id(carId);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Update quantity and days
        cartItem.quantity = quantity;
        cartItem.days = days;

        // Recalculate total based on the product price
        const product = await products.findById(cartItem.productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        cartItem.total = quantity * product.price * days;

        // Save the updated user document
        await user.save();

        // Send response
        res.json({ message: "Cart updated successfully", updatedItem: cartItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};



exports.deleteCart = async (req, res) => {
    console.log('Inside delete cart');

    const { cartId } = req.params; 
    const userId = req.userId;

    try {
        // Find the user
        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the cart item to delete
        const cartItemIndex = user.cart.findIndex(item => item._id.toString() === cartId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Remove the cart item from the user's cart array
        user.cart.splice(cartItemIndex, 1);

        await user.save();

     
        res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.addAddress = async (req, res) => {
    console.log(req.file); // Check if the file is being received
    console.log(req.body); // Check if other fields are being received
  
    const { name, phone, pincode, addresses, date, city, aadharNumber, acceptPolicy } = req.body;
    const userId = req.userId;
  
    if (!req.file) {
      return res.status(400).json({ message: 'Digital signature file is required' });
    }
  
    const digSign = req.file;
    const imgOneFilename = digSign.filename;
  
    try {
      const user = await users.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.address.push({
        name,
        phone,
        pincode,
        addresses,
        date,
        city,
        aadharNumber,
        digSign: imgOneFilename,
        acceptPolicy
      });
  
      await user.save();
      res.status(200).json({ message: 'Address added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };