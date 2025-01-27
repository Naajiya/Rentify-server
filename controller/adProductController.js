const products = require('../modal/adProductModal')



// add product

exports.addProduct = async (req, res) => {

    console.log('inides add project');

    const { name, description, price ,availability} = req.body;
    const { imgOne, imgTwo } = req.files;
    // const imgOne= req.file.filename
    // const imgTwo= req.file.filename



    if (!imgOne || !imgTwo) {
        return res.status(400).json({ message: 'Two images are required (imgOne and imgTwo).' });
    }

    const imgOneFilename = imgOne[0].filename;
    const imgTwoFilename = imgTwo[0].filename;

    const category={
        Men: req.body.category.includes('Men'),
        Women: req.body.category.includes('Women'),
        Furniture: req.body.category.includes('Furniture'),
    }

    const size = {
        S: req.body.size.includes('S'),
        M: req.body.size.includes('M'),
        L: req.body.size.includes('L'),
        Freeize: req.body.size.includes('Freeize')
    };

    // console.log(name, description, category, price, size,availability, imgOneFilename, imgTwoFilename);



    try {

        const existingProduct = await products.findOne({ name })

        if (existingProduct) {
            res.status(406).json("product already added")
        } else {
            const newProduct = new products({ name, description, category, price, size,availability, imgOne: imgOneFilename, imgTwo: imgTwoFilename})
            await newProduct.save()
            res.status(200).json(newProduct)
        }

    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }

}



// get all products
exports.getAllProduct = async(req,res)=>{
    // console.log('inside get all products')
    try{
        const allProduct = await products.find()
        
        console.log(allProduct)
        res.status(200).json(allProduct)
    }catch(err){
        res.status(401).json(err)
    }
}

// delete product
exports.deleteProduct = async(req,res)=>{
    console.log('inside delete products')

    const {proId}=req.params

    try{

        const deleteProduct= await products.findByIdAndDelete({_id:proId})
        res.status(200).json(deleteProduct)

    }catch(err){
        res.status(401).json(err)
        console.log(err)
    }
}

exports.updateProduct = async (req, res) => {
    console.log('update product');
    console.log(req.files); // Add logging to inspect req.files

    const { pid } = req.params;
    const { name, description, category, price, size, availability } = req.body;
    const { imgOne, imgTwo } = req.files || {}; // Safely destructuring

    let updateFields = { name, description, category, price, size, availability };

    if (imgOne) {
        updateFields.imgOne = imgOne[0]?.filename;
    }

    if (imgTwo) {
        updateFields.imgTwo = imgTwo[0]?.filename;
    }

    try {
        const updateProduct = await products.findByIdAndUpdate(pid, updateFields, { new: true });
        res.status(200).json(updateProduct);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err });
        console.error(err);
    }
};



exports.productCategory=async(req,res)=>{
    
    console.log('products by category')
    const {cat}=req.params

    const query = { [`category.${cat}`]: true };

    try{
        const productbycategory = await products.find(query)    

        if (!productbycategory.length) {
            return res.status(404).json({ message: 'No products found for this category' });
        }
        res.status(200).json(productbycategory);
    }catch(err){
        console.log(err)
        res.status(500).json({message: 'Server error'})
    }

    
}