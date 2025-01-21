const multer = require('multer');
// 
console.log('inside multer')
// storage space for user files
const storage = multer.diskStorage({
    
    // where to store which part , it have 3 arguments
    destination: (req, file, callback) => {
        // callback used to specify path
        // to crate a delay - callback
        console.log('multer middlerware') 
        callback(null, './uploads')


    },
    // filename
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}-${file.originalname}`)
    }
})

const multerMiddleware = multer({ storage });

module.exports = multerMiddleware;