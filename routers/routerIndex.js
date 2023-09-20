const express = require("express");
const router = express.Router();

const question = require("./question");
const auth = require("./auth");
const user = require("./user");
const admin = require("./admin")

//  /api geldiğinde  bu çalışacak

router.use("/questions",question);// api/question geldiğinde question.js e git
router.use("/auth",auth); // api/auth geldiğinde auth.js e git
router.use("/users",user);
router.use("/admin",admin);


module.exports = router;