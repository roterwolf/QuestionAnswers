const User = require("../models/User")
const CustomError = require("../helpers/error/CustomErrorHandler");
const asyncErrorWrapper = require('express-async-handler');


const blockUser  =  asyncErrorWrapper(async(req,res,next) =>{
    const {userid} = req.params;    
    const user = await User.findById(userid);   
    user.blocked = !user.blocked;
    await user.save();
    return res.status(200)
    .json({
        success : true,
        message : "Block / UnBlock başarılı bir şekilde yapıldı."
    })
});

const deleteUser  =  asyncErrorWrapper(async(req,res,next) =>{
    const {userid} = req.params;    
    await User.findByIdAndDelete(userid);
    return res.status(200)
    .json({
        success : true,
        message : "İlgili User başarılı bir şekilde silindi."
    })
});

module.exports = {
    blockUser,
    deleteUser
};

