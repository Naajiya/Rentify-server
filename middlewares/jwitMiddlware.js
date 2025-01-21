const jwt = require('jsonwebtoken');

const jwtMiddlware=(req,res,next)=>{
    console.log('inside jwit middleware')

    const token = req.headers["authorization"].split(" ")[1];
    
    if(token){
        console.log('token here')

        try{
            const jwtResponse = jwt.verify(token,process.env.JWT_PASSWORD)
            console.log(jwtResponse)
            console.log('its okey')
            
            next()

        }catch(err){
            res.status(401).json("authorization failed ..please login")
        }
    }else{
        res.status(401).json("authorization failed .. token is missing")
    }
}

module.exports =jwtMiddlware