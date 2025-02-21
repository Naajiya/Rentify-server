const express = require('express');
const adminController=require('../controller/adminController')
const jwitMiddlware = require('../middlewares/jwitMiddlware')
const multerMiddleware= require('../middlewares/multerMiddleware')
const adProductController = require('../controller/adProductController')
const userController = require('../controller/userController');
const jwtMiddlware = require('../middlewares/jwitMiddlware');

const orderController = require('../controller/orderController')
const revenueController = require('../controller/revenueController')


const router = new express.Router();


// admin

router.post('/login',adminController.adminLogin)

router.post('/addProducts', jwitMiddlware, multerMiddleware.fields([{ name: 'imgOne', maxCount: 1 }, { name: 'imgTwo', maxCount: 1 }]), adProductController.addProduct);
    
router.get('/get-all-products',adProductController.getAllProduct)

router.delete('/delete-product/:proId',adProductController.deleteProduct)

router.put('/update-product/:id', multerMiddleware.fields([{ name: 'imgOne', maxCount: 1 }, { name: 'imgTwo', maxCount: 1}]), adProductController.updateProduct)

router.get('/get-all-orders',orderController.getAllOrders)

router.put('/update-status/:orderId',orderController.updateStatus)

router.get('/get-revenue', revenueController.getRevenueDetails)

router.post('/add-expense', revenueController.addExpense)

router.get('/get-income', revenueController.getIncome)



// user

router.post('/user-Register',userController.userRegister)

router.post('/user-login',userController.userLogin)

router.get('/user-category/:cat', adProductController.productCategory)

router.get('/product-details/:proId',userController.viewProduct)

router.post('/add-to-cart',jwitMiddlware,userController.addToCart)

router.get('/get-carts',jwitMiddlware,userController.getCarts)
    
router.put('/change-cart/:carId', jwitMiddlware, userController.editCarts)

router.delete('/delete-cartItem/:cartId',jwitMiddlware,userController.deleteCart)

router.post('/add-address',multerMiddleware.single('digSign'),jwitMiddlware,userController.addAddress)

router.get('/get-address',jwitMiddlware,userController.getAddresses)

router.post('/create-order',jwitMiddlware,orderController.createOrder)

router.get('/get-user-order',jwitMiddlware, orderController.getUserOrder)

router.get('/get-search-products', adProductController.searchProducts)

router.get('/random-product', adProductController.getRandomProduct)

module.exports = router
