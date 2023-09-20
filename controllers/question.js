const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomErrorHandler");
const asyncErrorWrapper = require('express-async-handler');
const { request } = require("express");

const getAllQuestions = async (req, res, next) =>{
    res.status(200).json(res.queryResult);
}

const getSingleQuestions =asyncErrorWrapper( async (req, res, next) =>{
    res.status(200).json(res.queryResult);
})

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
    const information = req.body;
    const question = await Question.create({
        //title : information.title,
        //content : information.content  yada aşağıdaki gibiyapılır
        ...information,
        user : req.user.id
    }) 
    res.status(200)
    .json({
        success: true,
        data : question
    })

});

const editQuestion = asyncErrorWrapper(async (req, res, next) => {
    const {title,content} = req.body;
    const questionId = req.params.questionId;

    let question = await Question.findById(questionId);
    question.title = title;
    question.content = content;
    question.save();

    res.status(200)
    .json({
        success: true,
        data : question
    })
});

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
    const {title,content} = req.body;
    const questionId = req.params.questionId;

    let question = await Question.findById(questionId);
    question.deleteOne();

    res.status(200)
    .json({
        success: true,
        message : "Soru başarıyla silindi"
    })
});

const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const questionId = req.params.questionId;

    let question = await Question.findById(questionId);
    
    //Like etmiş ise tekrer like etmemeli

    if( question.likes.includes(req.user.id)){
        return next (new CustomError("Bu soruyu daha önce beğenmişsiniz.",400));
    }

    question.likes.push(req.user.id);
    question.likeCount = question.likes.length;
    await question.save();
    
    res.status(200)
    .json({
        success: true,
        data : question
    })
});

const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const questionId = req.params.questionId;

    let question = await Question.findById(questionId);
    
    //Like etmiş ise undo like yapalım

    if(!question.likes.includes(req.user.id)){
        return next (new CustomError("Bu soruyu beğenmediğiniz için geri alamazsınız.",400));
    }

    const index = question.likes.indexOf(req.user.id);
    question.likes.splice(index);
    question.likeCount = question.likes.length;
    await question.save();

    res.status(200)
    .json({
        success: true,
        data : question
    })
});

module.exports = {
    getAllQuestions,
    getSingleQuestions,
    askNewQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
};