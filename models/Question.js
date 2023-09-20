const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require ("slugify")

const QuestionSchema = new Schema({
    title:{
        type : String,
        required : [true,"Lütfen başlık giriniz."],
        minlength : [10,"Lütfen en az 10 karekter giriniz."],
        unique : true
    },
    content : {
        type : String,
        required : [true,"Lütfen içerik giriniz."],
        minlength : [20,"Lütfen en az 20 karekter giriniz."],
        unique : true
    },
    slug : String,
    createAt : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "User"
    },
    likes : [

        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ],
    likeCount : {
        type : Number,
        default  : 0
    },
    answers : [
        {
            type : mongoose.Schema.ObjectId,
            ref  : "Answer"
        }
    ],
    answerCount : {
        type : Number,
        default  : 0
    }

});

QuestionSchema.pre("save",function(next){

    if(!this.isModified("title")){
        next();
    }
    this.slug = this.makeSlug();
    next();
});

QuestionSchema.methods.makeSlug = function(){
    return slugify(this.title, {
        replacement: '-',  
        remove: /[*+~.()'"!:@]/g, 
        lower: true,
        trim: true
      })
}

module.exports = mongoose.model('Question',QuestionSchema);
