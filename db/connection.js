const mongoose = require('mongoose');

const connectionstring=process.env.CONNECTION_STRING

mongoose.connect(connectionstring).then(()=>{
    console.log('connected to database')
}).catch(err=>{
    console.log(err)
    console.log('not connected to database')
})