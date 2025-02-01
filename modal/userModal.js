const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    cart:[
        {
            productId:{ type:mongoose.Schema.Types.ObjectId, ref:'products'},
            quantity:{type:Number, default:1},
            days:{type:Number, default:2},
            size:{type:String},
            total:{type:Number}
        },
    ],

})

const users=mongoose.model("users",userSchema)
module.exports=users