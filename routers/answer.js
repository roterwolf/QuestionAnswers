const express = require("express");
const {getAccessToRoute,getAnswerOwnerAccess} = require ("../middlewares/authorization/auth")
const {checkQuestionAndAnswerExist} = require("../middlewares/database/databaseErrorHelpers");
const{getAllAnswersByQuestion,addNewAnswerToQuestion,getSingleAnswer,editAnswer,deleteAnswer,likeAnswer,undoLikeAnswer} = require("../controllers/answer");
const router = express.Router({mergeParams : true}); //bir üst route dan gelen parametreleri bu route a geçmesini sağlıyoruz.

router.get("/",getAccessToRoute,getAllAnswersByQuestion)
router.get("/:answerId",getAccessToRoute,checkQuestionAndAnswerExist,getSingleAnswer)
router.post("/addAnswer",getAccessToRoute,addNewAnswerToQuestion)
router.put("/:answerId/edit",[getAccessToRoute,checkQuestionAndAnswerExist,getAnswerOwnerAccess],editAnswer)
router.delete("/:answerId/delete",[getAccessToRoute,checkQuestionAndAnswerExist,getAnswerOwnerAccess],deleteAnswer)
router.put("/:answerId/like",[getAccessToRoute,checkQuestionAndAnswerExist],likeAnswer);
router.put("/:answerId/undoLike",[getAccessToRoute,checkQuestionAndAnswerExist],undoLikeAnswer);

module.exports = router;