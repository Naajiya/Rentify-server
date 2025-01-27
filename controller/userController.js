const users = require('../modal/userModal')
const jwt=require('jsonwebtoken')
const products = require('../modal/adProductModal')

// register
exports.userRegister = async (req, res) => {

    console.log("inside register Controller")

    const { username, email, password } = req.body;
    console.log(username, email, password);
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
exports.userLogin= async (req,res)=>{
    const {email,password}=req.body
    try{
        const existingUser=await users.findOne({email,password})
        if(existingUser){
            const token= jwt.sign({ userId: existingUser._id }, process.env.JWT_PASSWORD)
            res.status(200).json({ user: existingUser, token })
        }else{
            res.status(404).json("invalid username or password")
        
        }
    }catch(err){
        console.log(err)
    }
}


exports.viewProduct = async (req, res) => {
    const { proId } = req.params;
    try {
        // Fetch the product using findOne (assuming proId is unique)
        const productDetails = await products.findOne({_id:proId});
        console.log(productDetails);

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

