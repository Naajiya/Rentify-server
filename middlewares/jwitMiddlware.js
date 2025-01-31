const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    console.log('inside jwt middleware')
    console.log(req.headers)
    // console.log(req.body)
    const token = req.headers.authorization
    console.log(token)

    if (token) {

        try {
            const jwtResponse = jwt.verify(token, process.env.JWT_PASSWORD)
            console.log('res')
            console.log(jwtResponse)
            req.userId = jwtResponse.userId
            // console.log(userId)
            next()
            console.log('jwt complte')
        } catch (err) {
            res.status(401).json("authorization failed ..please login")
        }
    } else {
        res.status(402).json("authorization failed .. token is missing")
    }
};

module.exports = jwtMiddleware;
