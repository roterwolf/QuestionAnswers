const express = require("express");
const {checkUserExist} = require("../middlewares/database/databaseErrorHelpers")
const {getSingleUser, getAllUsers} = require("../controllers/user")
const userQueryMiddleware = require("../middlewares/query/userQueryMiddleware")
const User = require("../models/User")

const router = express.Router();

router.get("",userQueryMiddleware(User),getAllUsers);
router.get("/:userid",checkUserExist,getSingleUser);    

module.exports = router;