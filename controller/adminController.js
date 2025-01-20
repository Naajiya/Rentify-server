const admins = require('../modal/adminModal')
const jwt = require('jsonwebtoken')

const newAdmin = new admins({
    email: 'naj@gmail.com',
    password: 'najsecure123'
})

newAdmin.save().then(() => console.log('Admin saved successfully'))
    .catch(err => console.error('Error saving admin:', err));

exports.adminLogin = async (req, res) => {
    console.log('inside admin login');
    const { email, password } = req.body;

    try {
        const isAdmin = await admins.findOne({ email, password });
        if (isAdmin) {
            console.log('login successfully')

            const token = jwt.sign({ adminId: isAdmin._id },process.env.JWT_PASSWORD )

            res.status(200).json({admin:isAdmin,token})
        } else {
            res.status(406).json('invalid email or password')
        }
    } catch (err) {
        console.log(err)
        res.status(401).json(err)
    }
}