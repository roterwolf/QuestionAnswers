const CustomError = require("../../helpers/error/CustomErrorHandler");
const User = require("../../models/User");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");
const asyncErrorWrapper = require('express-async-handler');

const jwt = require("jsonwebtoken");
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers");

const getAccessToRoute = (req,res,next) =>{
    const {JWT_SECRET_KEY} = process.env;

    if(!isTokenIncluded(req)){
        return next( new CustomError("Yetki hatası. Token alınamadı. Lütfen Giriş Yapınız.",401))
    }

    const access_token = getAccessTokenFromHeader(req);
    //Token doğrulama yapıyoruz
    jwt.verify(access_token,JWT_SECRET_KEY,(err,decoded)=>{
        if(err){
            return next( new CustomError("Yetki hatası. Token çözümlenemedi. Lütfen Giriş Yapınız. "+ err,401))
        }
        req.user = {
            id : decoded.id,
            name : decoded.name
        }
    });
    next();
}
const getAdminAccess = asyncErrorWrapper (async(req, res, next)=>{

    const {id} = req.user;
    const user = await User.findById(id);
    if(user.role !== "admin"){
        return next( new CustomError("Bu sayfaya sadece Admin User'lar girebilir.",403));
    }
    next ();
})

const getQuestionOwnerAccess = asyncErrorWrapper (async(req, res, next)=>{

    const userId = req.user.id;
    const questionId = req.params.questionId;
    const question = await Question.findById(questionId);
    if(question.user != userId){
        return next( new CustomError("Sadece kendi sorunuza müdahale edebilirsiniz.",403));
    }
    next ();
})

const getAnswerOwnerAccess = asyncErrorWrapper (async(req, res, next)=>{

    const userId = req.user.id;
    const answerId = req.params.answerId;
    const answer = await Answer.findById(answerId);
    if(answer.user != userId){
        return next( new CustomError("Sadece kendi cevabınıza müdahale edebilirsiniz.",403));
    }
    next ();
})
module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
}
























