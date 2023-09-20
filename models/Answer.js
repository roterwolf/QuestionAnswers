const mongoose = require("mongoose");
const Question = require("./Question");
const Schema = mongoose.Schema;



const AnswerSchema = new Schema({
    content : {
        type :String,
        required : [true, "Lütfen cevap giriniz!"],
        minlength :[10, "Lütfen en az 10 karekter giriniz!"]
    },
    createdAt : {
        type: Date,
        default : Date.now
    },
    user : {
        type: mongoose.Schema.ObjectId,
        ref : "User",
        reuired : [true,"Kullanıcı bilgisi olmadan cevap kaydedilemez!"]
    },
    question : {
        type : mongoose.Schema.ObjectId,
        ref  : "Question",
        required : [true,"Soru bilgisi olmadan cevap kaydedilemez!"]
    },
    likes : [
        {
        type : mongoose.Schema.ObjectId,
        ref  : "User"
        }
    ],
    likeCount : {
        type : Number,
        default  : 0
    }
    
});

AnswerSchema.pre("save", async function(next){
    if(!this.isModified("user")){// her cevap verildiğinde Question Modelindeki answers array inin içeinde set ediyoruz.
        return next();
    }
    try{
        const question = await Question.findById(this.question);
        question.answers.push(this._id);
        question.answerCount = question.answers.length;
        await question.save();
        next();
    } catch (err){
        return next(err);
    } 

});
module.exports = mongoose.model("Answer",AnswerSchema);