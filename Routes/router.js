const express = require('express');
const adminController=require('../controller/adminController')
const jwitMiddlware = require('../middlewares/jwitMiddlware')
const multerMiddleware= require('../middlewares/multerMiddleware')
const adProductController = require('../controller/adProductController')
const userController = require('../controller/userController');
const jwtMiddlware = require('../middlewares/jwitMiddlware');


const router = new express.Router();


// admin

router.post('/login',adminController.adminLogin)

router.post('/addProducts', jwitMiddlware,multerMiddleware.fields([{ name: 'imgOne', maxCount: 1 }, { name: 'imgTwo', maxCount: 1}]),adProductController.addProduct )

router.get('/get-all-products',adProductController.getAllProduct)

router.delete('/delete-product/:proId',adProductController.deleteProduct)

router.put('/update-product/:pid', multerMiddleware.fields([{ name: 'imgOne', maxCount: 1 }, { name: 'imgTwo', maxCount: 1}]), adProductController.updateProduct)




// user

router.post('/user-Register',userController.userRegister)

router.post('/user-login',userController.userLogin)

router.get('/user-category/:cat', adProductController.productCategory)

router.get('/product-details/:proId',userController.viewProduct)

router.post('/add-to-cart',jwitMiddlware,userController.addToCart)

router.get('/get-carts',jwitMiddlware,userController.getCarts)

module.exports = router
