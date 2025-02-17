require('dotenv').config()
// config is a method to when the application run then load from env variable to process
const razorpay= require('razorpay')

const express = require('express')
const cors= require('cors')
// client request to accepts in server side

const router=require('./Routes/router')
const Razorpay = require('razorpay')
require('./db/connection')
const crypto = require('crypto')

const rentServer = express()
rentServer.use(cors())
rentServer.use(express.json()) //convert json to js object (it act as middleware)
rentServer.use(router)

rentServer.use('/uploads', express.static('./uploads'))

const PORT =3000 || process.env.PORT

// to run
rentServer.listen(PORT, ()=>{
    console.log(`server running port ${PORT}`)
    
})

rentServer.get('/',(req,res)=>{
    res.status(200).send(`<h1>server started at port 3000</h1>`)
   
})
// logic 

rentServer.use(express.urlencoded({extended:'false'}))

rentServer.post('/order', async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
        });

        const options = req.body;

        // Validate request body
        if (!options.amount || !options.currency || !options.receipt) {
            return res.status(400).json({ error: 'Invalid request body. Amount, currency, and receipt are required.' });
        }

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ error: 'Failed to create order' });
        }

        res.status(200).json(order);
    } catch (err) {
        console.error('Error creating Razorpay order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

rentServer.post('/order/validate', async (req,res)=>{

    const {razorpay_order_id , razorpay_payment_id,razorpay_signature}=req.body

    const sha = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const digest = sha.digest('hex')
    if(digest !== razorpay_signature){
        return res.status(400).json()
    }
    res.json({
        msg:'success',
        orderId:razorpay_order_id,
        paymentId:razorpay_payment_id
    })

})