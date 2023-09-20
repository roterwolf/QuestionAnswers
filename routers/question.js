const express = require("express");
const answer = require("./answer");
const Question = require("../models/Question");
const { getAllQuestions, askNewQuestion, getSingleQuestions, editQuestion, deleteQuestion, likeQuestion, undoLikeQuestion } = require("../controllers/question")
const { getAccessToRoute, getQuestionOwnerAccess } = require("../middlewares/authorization/auth")
const { checkQuestionExist } = require("../middlewares/database/databaseErrorHelpers")
const questionQueryMiddleware = require("../middlewares/query/questionQueryMiddleware");
const answerQueryMiddleware = require("../middlewares/query/answerQueryMiddleware")
const router = express.Router();

// api/questions  yazıldığında buraya yönlenmesi gerek
router.use("/:questionId/answers", checkQuestionExist, answer); //Soruya cevap geliyorsa bu route git
router.get("/",questionQueryMiddleware(
    Question,{
        population : {
            path : "user",
            select : "name profile_image"
        }
    }), getAllQuestions)
router.post("/ask", getAccessToRoute, askNewQuestion,);
router.get("/:questionId", answerQueryMiddleware(Question,{
    population :[
        {
            path:"user",
            select:"name profile_image"
        },
        {
            path:"answers",
            select:"content"
        }
]
}),checkQuestionExist, getSingleQuestions);
router.put("/:questionId/edit", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion);
router.delete("/:questionId/delete", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion);
router.put("/:questionId/like", [getAccessToRoute, checkQuestionExist], likeQuestion);
router.put("/:questionId/undo_like", [getAccessToRoute, checkQuestionExist], undoLikeQuestion);


// router.get("/",(req,res) =>{
//     res.status(200).json({success : true, data: "Questions Home Page"});
// })

// router.get("/delete",(req,res) =>{
//     res.send("Questions Delete Page");
// })

module.exports = router;