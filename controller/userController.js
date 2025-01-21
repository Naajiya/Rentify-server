const users=require('../modal/userModal')       

exports.userOtp = async (req,res)=>{
    console.log('otps')

    const {phoneNumber}=req.body;
    console.log(phoneNumber);

    
}