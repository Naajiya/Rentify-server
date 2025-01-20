const admins = require('../modal/adminModal')

const newAdmin= new admins({
    email:'naj@gmail.com',
    password:'najsecure123'
})

newAdmin.save().then(() => console.log('Admin saved successfully'))
.catch(err => console.error('Error saving admin:', err));

exports.adminLogin = async(req,res)=>{
    console.log('inside admin login');
    const {email,password}=req.body;

    try{
        const isAdmin = await admins.findOne({email,password});
        if(isAdmin){
            console.log('login successfully')
            res.status(200).json()
        }else{
            res.status(406).json('invalid email or password')
        }
    }catch(err){
        console.log(err)
        res.status(401).json(err)
    }
}