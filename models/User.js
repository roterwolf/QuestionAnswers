const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { application } = require("express");
const Schema = mongoose.Schema;
const Question = require("./Question");

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Lütfen isim giriniz"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Lütfen e-mail adresini doğru giriniz."]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    password: {
        type: String,
        minlength: [6, "Lütfen en az 6 karekterli bir şifre griniz"],
        required: [true, "Lütfen şifre giriniz."],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String
    },
    about: {
        type: String
    },
    place: {
        type: String
    },
    website: {
        type: String
    },
    profile_image: {
        type: String,
        default: "default.jpg"
    },
    blocked: {
        type: Boolean,
        default: false
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpire : {
        type : Date
    }
})

//Users Methods
UserSchema.methods.generateJwtFromUser = function () {

    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

    const payload = {
        id: this.id,
        name: this.name
    }

    const token = jwt.sign(payload, JWT_SECRET_KEY,
        {
            expiresIn: JWT_EXPIRE
        }
    );

    return token;
}

UserSchema.methods.getResetPasswordTokenFromUser = function (){
    const randomHexString = crypto.randomBytes(15).toString("hex");
    const {RESET_PASSWORD_EXPIRE} = process.env;

    const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);
    return resetPasswordToken;
}

//Pre hooks
UserSchema.pre('save', function (next) {
    //her user kaydedilirken çalışacak
    //eğer paola değişmiş ise çalışsın
    if (!this.isModified('password')) {
        next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) next(err);
            this.password = hash;
            next();
        })
    })

});


UserSchema.post("findOneAndDelete",async function(doc){

    console.log ("Delete User Post :"+doc._id);
    await Question.deleteMany({
        user : doc._id
    })
});
module.exports = mongoose.model("User", UserSchema);