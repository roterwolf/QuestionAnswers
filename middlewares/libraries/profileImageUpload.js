const multer = require("multer");//Dosya Yükleme işlemleri için kullndığımız kütüphane
const path = require("path");
const CustomError = require("../../helpers/error/CustomErrorHandler");

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        const rootDir = path.dirname(require.main.filename) // server.js dosyasının yolunu aldık
        cb(null,path.join(rootDir + "/public/uploads"))
    },
    filename: (req,file,cb) => {
        //File save - Filter
        const fileType = file.mimetype.split("/")[1];
        req.savedProfileImage = "image_" + req.user.id + "." + fileType;
        //cb(null,file.fieldname + '-' + path.extname(file.originalname));
        cb(null,req.savedProfileImage);
    }
});

const fileFilter  = (req,file,cb) =>{
    let allowedMimeTypes = ["image/jpg","image/jpeg","image/gif","image/png"];

    if(!allowedMimeTypes.includes(file.mimetype)){
        return cb(new CustomError("Lütfen geçerli bir dosya seçin",400),false);
    }
    return cb(null, true);
};

const profileImageUpload = multer({storage, fileFilter});

module.exports = profileImageUpload;


