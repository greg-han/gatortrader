
//trying to write this functionally.
//all multer upload logic will go in this file
module.exports = () => {
    var multer = require('multer');
   //This will be where uploaded files (pictures) are stored.
   //We will need to implement file size and type restrictions soon
   //These things are probably built into multer, but we have a proof of concept now.
    var imagestore = multer.diskStorage({
        destination : async function(req, file, callback){
            callback(null,"../pubilc/images")
        },
        filename : async function(req, file, callback){
            callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        }
    });

     let uploader = multer({
       imgstore: imagestore
    });
     return uploader;
}
