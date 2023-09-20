const CustomError = require("../../helpers/error/CustomErrorHandler");
const customErrorHandler = (err,req,res,next) =>{
    let customError = err;
    if(err.name === "SyntaxError"){
        customError = new CustomError("Söz dizimi hatası",400);
    }
    if(err.name === "ValidationError"){
        customError = new CustomError("Doğrulama Hatası:"+ err.message,400);
     }
     
     if(err.name === "CastError"){
        customError = new CustomError("Lütfen geçerli bir id giriniz.",400);
     }

     if(err.code === 11000){;
        customError = new CustomError("Benzersiz Kayıttan tekrarlama yapılıyor. Lütfen girdiğiniz verileri kontrol ediniz.", 400);
     }
     
    //     Veya aşağıdaki gibi hepsini yakalar.
    //     customError = new CustomError(err.message,400);
    // }

    res
    .status(customError.status || 500)
    .json({
        success : false,
        message : customError.message || "Internal Server Error"
    });
}

module.exports = customErrorHandler;