require('dotenv').config()
// config is a method to when the application run then load from env variable to process

const express = require('express')
const cors= require('cors')
// client request to accepts in server side

const router=require('./Routes/router')
require('./db/connection')

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