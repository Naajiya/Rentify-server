const products = require('../modal/adProductModal')

exports.addProduct = async (req, res) => {

    console.log('inides add project');

    const { name, description, category, price } = req.body;
    const { imgOne, imgTwo } = req.files;
    // const imgOne= req.file.filename
    // const imgTwo= req.file.filename



    if (!imgOne || !imgTwo) {
        return res.status(400).json({ message: 'Two images are required (imgOne and imgTwo).' });
    }

    const imgOneFilename = imgOne[0].filename;
    const imgTwoFilename = imgTwo[0].filename;

    const size = {
        S: req.body.size.includes('S'),
        M: req.body.size.includes('M'),
        L: req.body.size.includes('L'),
    };

    console.log(name, description, category, price, size, imgOneFilename, imgTwoFilename);



    try {

        const existingProduct = await products.findOne({ name })

        if (existingProduct) {
            res.status(406).json("product already added")
        } else {
            const newProduct = new products({ name, description, category, price, size, imgOne: imgOneFilename, imgTwo: imgTwoFilename})
            await newProduct.save()
            res.status(200).json(newProduct)
        }

    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }

}