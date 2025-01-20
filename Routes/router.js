const express = require('express');
const adminController=require('../controller/adminController')

const router = new express.Router();


router.post('/login',adminController.adminLogin)


module.exports = router