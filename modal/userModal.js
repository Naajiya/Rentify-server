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
    otp:{
        type:Number,
        required:true
    },
    otpExpires:{
        type:Date
    },
    verified:{
        type:Boolean,
        default:false
    }

})

const users=mongoose.model("users",userSchema)
module.exports=users