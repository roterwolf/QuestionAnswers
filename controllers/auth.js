const User = require("../models/User")
const CustomError = require("../helpers/error/CustomErrorHandler");
const asyncErrorWrapper = require('express-async-handler');
const {sendJwtToClient} = require("../helpers/authorization/tokenHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");
const {validateUserInput, comparePassword} = require("../helpers/authorization/inputHelpers");


const getAllAut = (req, res, next) => {
    res.status(200).json({ success: true, data: "Auth Home Page" });
};
 
const register = asyncErrorWrapper(async (req, res, next) => {
    //Asenkron isteklerde hata yakalanmaası için try catch e almak gerekiyor 
    //ve hatayı next ile göndermek gerekiyor.
    //yada express-async-handler kütüphanesi bunu kendisi yapıyor.

    // const name = "Deeme";
    // const email = "deneme@gmail.com";
    // const password = "12345";
    const{name,email,password,role} = req.body;//express.json() kütüphanesi ile bodyi alıyoruz.
    //async,await

    //try {
        const user = await User.create({
            name, email, password,role
        })  
        sendJwtToClient(user, res);
        res.status(200)
            .json({ success: true, data: user });
    ////} catch (err) {
        return next(new CustomError(err,401));
    ////}
});

const login = asyncErrorWrapper(async (req, res, next) => {
    const {email, password} = req.body;

    if(!validateUserInput(email, password)){        
        return next(new CustomError("Lütfen mail ve şifre bilgilerinizi kontrol ediniz.",401))
    }

    const user = await User.findOne({email}).select("+password");
    if(!comparePassword(password,user.password)){
        return next(new CustomError("Şifreniz hatalıdır.",400))
    }
    sendJwtToClient(user, res);
    res.status(200)
    .json({ 
        success : true
    })    
});

const logout = asyncErrorWrapper(async (req, res, next) => {
    const JWT_NODE_ENV = process.env.JWT_NODE_ENV;

    res.status(200)
    .cookie({
        httpOnly : true,
        expires : new Date(Date.now()),
        secure : JWT_NODE_ENV ==="development" ? false : true
    })
    .json({
        success : true,
        message : "Çıkış işlemi başarılı bir şekilde yapılmıştır."
    })

});

const getUser = (req,res,next) =>{
    res.status(200)
    .json(
        { success: true,
         data: {
            id:req.user.id,
            name:req.user.name
         }
        });
}

const imageUpload = asyncErrorWrapper(async(req,res,next) =>{
    const user = await User.findByIdAndUpdate(req.user.id,{
        profile_image : req.savedProfileImage
    }, {
        new : true,//kaydedilmiş veriyi döndürmek için
        runValidators : true
    })
    res.status(200)
    .json({
        success : true,
        message : "Resim yükleme başarılı",
        data : user
    })
});

const forgotPassword = asyncErrorWrapper(async(req,res,next) =>{
    const resetEmail = req.body.email;
    const user = await User.findOne({email : resetEmail});

    if (!user){
        return next (new CustomError("İlgili mail adresi bulunamamıştır.",400 ));
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser();
    await user.save();
    const resetPasswordUrl = `${process.env.SERVER_URL}/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    const emailTemplate = `
    <h3>Reset Your Password</h3>
    <p>This <a href='${resetPasswordUrl}' target='_blank'> link </a> will expire 1 hour</p>
    `;
     
    try{
        await sendEmail({
            from: process.env.SMTP_USER,
            to:resetEmail,
            subject:'Reset Your Password',
            html:emailTemplate
        })
        return res.status (200)
        .json({
        success: true,
        message : "Şifre sıfırlama Tokenı mailinize gönderildi"
    })

    }catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(new CustomError("Email gönderilemedi",500));
    }
});

const resetPassword = asyncErrorWrapper(async(req,res,next) =>{

    const {resetPasswordToken} = req.query;
    const {password} = req.body;

    if(!resetPasswordToken){
        return next(new CustomError("Lütfen geçerli bir token giriniz.",400));
    }
    
    const user = await User.findOne({
    resetPasswordToken : resetPasswordToken,
    resetPasswordExpire : {$gt : Date.now()}
    });

    if(!user){
        return next(new CustomError("Token süresi dolmuştur."));
    }

    user.password = password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken  = undefined;
    await user.save();

    res.status(200)
    .json({
        success: true,
        message : "Şifre sıfırlama başarılı"
    })
});

const editDetails = asyncErrorWrapper(async(req,res,next) =>{
    const userInformation = req.body;

    const user = await User.findByIdAndUpdate(req.user.id,userInformation,{
        new : true,
        runValidators : true        
    })

    res.status(200)
    .json({
        success : true,
        data : user
    })
});
module.exports = {
    getAllAut,
    register,
    login,
    logout,
    getUser,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
}