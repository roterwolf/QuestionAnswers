const User = require("../../models/User");
const CustomError = require("../../helpers/error/CustomErrorHandler");
const asyncErrorWrapper = require('express-async-handler');
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");

const checkUserExist  =  asyncErrorWrapper(async(req,res,next) =>{
    const {userid} = req.params;
    if(!userid){
        return next(new CustomError("Lütfen bir id giriniz.",400));
    }

    const user = await User.findById(userid);
    if(!user){
        return next (new CustomError("Kullanıcı bulunamadı!",400));
    }
    req.data = user;
    next();

});

const checkQuestionExist  =  asyncErrorWrapper(async(req,res,next) =>{
    const {questionId} = req.params;

    if(!questionId){
        return next(new CustomError("Lütfen bir id giriniz.",400));
    }

    const question = await Question.findById(questionId);
    if(!question){
        return next (new CustomError("Soru bulunamadı!",400));
    }
    req.data = question;
    next();

});

const checkQuestionAndAnswerExist  =  asyncErrorWrapper(async(req,res,next) =>{
    const questionId = req.params.questionId;
    const answerId = req.params.answerId

    if(!questionId || !answerId){
        return next(new CustomError("Lütfen soru yada cevap idsi giriniz.",400));
    }

    const answer = await Answer.findOne({
        _id  : answerId,
        question : questionId
    })
    if(!answer){
        return next (new CustomError("Cevap bulunamadı!",400));
    }
    next();

});

module.exports = {
    checkUserExist,
    checkQuestionExist,
    checkQuestionAndAnswerExist
};