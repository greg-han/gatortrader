
//static
var multer = require('multer');
const path = require('path');
var imagestore = multer.diskStorage({
    destination: function(req, file, callback) {
       callback(null, path.join(__dirname,'../public/images'))
    },
    filename: function(req, file, callback){
       callback(null, file.originalname)
    }
});

let uploader = multer({
    storage: imagestore
});

module.exports = uploader;

//functional
/*
module.exports = () => {
    var multer = require('multer');
   //This will be where uploaded files (pictures) are stored.
   //We will need to implement file size and type restrictions soon
   //These things are probably built into multer, but we have a proof of concept now.
    var imagestore = multer.diskStorage({
        destination : async function(req, file, callback){
            callback(null,"test/")
        },
        filename : async function(req, file, callback){
            //callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
            callback(null, file.originalname + "_" + Date.now());
        }
    });

     let uploader = multer({
       imagestore
    });
     return uploader;
}
     */
