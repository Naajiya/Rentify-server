const products = require('../modal/adProductModal')



// add product

exports.addProduct = async (req, res) => {
    console.log('inside add product');
    console.log(req.body);

    const { name, description, price, availability, category, size } = req.body;
    console.log(name, description, price);

    const { imgOne, imgTwo } = req.files;
    console.log(imgOne);

    if (!imgOne || !imgTwo) {
        return res.status(400).json({ message: 'Two images are required (imgOne and imgTwo).' });
    }

    const imgOneFilename = imgOne[0].filename;
    const imgTwoFilename = imgTwo[0].filename;

    // Convert category to an array (ensure it's always an array)
    const categoryArray = Array.isArray(category) ? category : [category];

    // Convert size to an array (ensure it's always an array)
    const sizeArray = Array.isArray(size) ? size : JSON.parse(size);
    
    try {
        const existingProduct = await products.findOne({ name });

        if (existingProduct) {
            return res.status(406).json("Product already added");
        }

        const newProduct = new products({
            name,
            description,
            category: categoryArray,  // Matches schema (array of strings)
            price,
            size: sizeArray,  // Matches schema (array of strings)
            availability,
            imgOne: imgOneFilename,
            imgTwo: imgTwoFilename
        });

        await newProduct.save();
        res.status(200).json(newProduct);

    } catch (err) {
        console.log(err);
        res.status(401).json(err);
    }
};




// get all products
exports.getAllProduct = async (req, res) => {
    // console.log('inside get all products')
    try {
        const allProduct = await products.find()

        // console.log(allProduct)
        res.status(200).json(allProduct)
    } catch (err) {
        res.status(401).json(err)
    }
}

// delete product
exports.deleteProduct = async (req, res) => {
    console.log('inside delete products')

    const { proId } = req.params

    try {

        const deleteProduct = await products.findByIdAndDelete({ _id: proId })
        res.status(200).json(deleteProduct)

    } catch (err) {
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

    const imgOneFile = req.files?.imgOne ? req.files.imgOne[0].filename : null;
    const imgTwoFile = req.files?.imgTwo ? req.files.imgTwo[0].filename : null;

    // Initialize updateFields before modifying it
    let updateFields = { 
        name, 
        description, 
        categoryArray: Array.isArray(category) ? category : [category], 
        price, 
        sizeArray: Array.isArray(size) ? size : JSON.parse(size), 
        availability 
    };

    // Add images only if they exist
    if (imgOneFile) updateFields.imgOne = imgOneFile;
    if (imgTwoFile) updateFields.imgTwo = imgTwoFile;

    try {
        const updateProduct = await products.findByIdAndUpdate(pid, updateFields, { new: true });
        res.status(200).json(updateProduct);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err });
        console.error(err);
    }
};




exports.productCategory = async (req, res) => {
    console.log('Fetching products by category');
    const { cat } = req.params;
    console.log(cat);

    try {
        // Find products where the category array contains the given category
        const productByCategory = await products.find({ category: cat });

        if (!productByCategory.length) {
            return res.status(404).json({ message: 'No products found for this category' });
        }

        res.status(200).json(productByCategory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
