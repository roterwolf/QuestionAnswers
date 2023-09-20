const User = require("../models/User")
const CustomError = require("../helpers/error/CustomErrorHandler");
const asyncErrorWrapper = require('express-async-handler');

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {
    /* const userid = req.params.userid;
     const user = await User.findById(userid);
     yada önceki kontrollerdan user alıp burda kullanabiliriz.*/
    const user = req.data;
    return res.status(200)
        .json({
            succes: true,
            data: user
        })
});
const getAllUsers = asyncErrorWrapper(async (req, res, next) => {

    const users = await User.find();
    return res.status(200)
        .json(res.queryResult)
});

module.exports = {
    getSingleUser,
    getAllUsers
}