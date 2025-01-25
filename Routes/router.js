const express = require('express');
const adminController=require('../controller/adminController')
const jwitMiddlware = require('../middlewares/jwitMiddlware')
const multerMiddleware= require('../middlewares/multerMiddleware')
const adProductController = require('../controller/adProductController')


const router = new express.Router();




router.post('/login',adminController.adminLogin)

router.post('/addProducts', jwitMiddlware,multerMiddleware.fields([{ name: 'imgOne', maxCount: 1 }, { name: 'imgTwo', maxCount: 1}]),adProductController.addProduct )

router.get('/get-all-products',adProductController.getAllProduct)

router.delete('/delete-product/:proId',adProductController.deleteProduct)

router.put('/update-product/:pid', multerMiddleware.fields([{ name: 'imgOne', maxCount: 1 }, { name: 'imgTwo', maxCount: 1}]), adProductController.updateProduct)


module.exports = router
