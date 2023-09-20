const Answer = require("../models/Answer");
const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomErrorHandler");
const asyncErrorWrapper = require('express-async-handler');


const getAllAnswersByQuestion  =  asyncErrorWrapper(async(req,res,next) =>{
    const {questionId} = req.params;

    const question = await Question.findById(questionId).populate("answers");
     //populate denildiğinde Fk bağlı olan obje bilgilerinide komple getirir  
     // bu denmez ise answers da sadece id ler görünür.
    
    const answers = question.answers;
    return res.status(200)
    .json({
        success : true,
        count : answers.length,
        data : answers
    })
});

const getSingleAnswer  =  asyncErrorWrapper(async(req,res,next) =>{
    const {answerId} = req.params;

    const answer = await Answer.findById(answerId)
    .populate({
        path : "question",
        select : "title"
    })
    .populate({
        path : "user",
        select : "name profile_image"
    });

    return res.status(200)
    .json({
        success : true,
        data : answer
    })
});

const addNewAnswerToQuestion  =  asyncErrorWrapper(async(req,res,next) =>{
    const information = req.body;
    const userid = req.user.id; 
    const {questionId} = req.params;

    const answer = await Answer.create({
        ...information,
        question : questionId,
        user : userid
    }) 
    
    return res.status(200)
    .json({
        success : true,
        answers : answer
    })
});

const editAnswer  =  asyncErrorWrapper(async(req,res,next) =>{
    const {answerId} = req.params;
    const {content} = req.body;


    let answer = await Answer.findById(answerId)
    
    answer.content = content;
    await answer.save();
    return res.status(200)
    .json({
        success : true,
        data : answer
    })
});

const deleteAnswer  =  asyncErrorWrapper(async(req,res,next) =>{
    const {answerId,questionId} = req.params;

    await Answer.findByIdAndRemove(answerId);
    const question = await Question.findById(questionId);

    question.answers.splice(question.answers.indexOf(answerId));
    question.answerCount = question.answers.length;
    await question.save();

    return res.status(200)
    .json({
        success : true,
        message : "Cevabınız başarı ile silinmiştir."
    })
});

const likeAnswer = asyncErrorWrapper(async (req, res, next) => {
    const {answerId} = req.params;

    let answer = await Answer.findById(answerId);
    
    //Like etmiş ise tekrer like etmemeli

    if( answer.likes.includes(req.user.id)){
        return next (new CustomError("Bu cevabı daha önce beğenmişsiniz.",400));
    }

    answer.likes.push(req.user.id);
    answer.likeCount = answer.likes.length;
    await answer.save();
    
    res.status(200)
    .json({
        success: true,
        data : answer
    })
});

const undoLikeAnswer = asyncErrorWrapper(async (req, res, next) => {
    const answerId = req.params.answerId;

    let answer = await Answer.findById(answerId);
    
    //Like etmiş ise undo like yapalım

    if(!answer.likes.includes(req.user.id)){
        return next (new CustomError("Bu cevabı beğenmediğiniz için geri alamazsınız.",400));
    }

    const index = answer.likes.indexOf(req.user.id);
    answer.likes.splice(index);
    answer.likeCount = answer.likes.length;
    await answer.save();

    res.status(200)
    .json({
        success: true,
        data : answer
    })
});


module.exports = {
    getAllAnswersByQuestion,
    getSingleAnswer,
    addNewAnswerToQuestion,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    undoLikeAnswer
}