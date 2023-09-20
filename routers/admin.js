const express = require("express");
const { getAccessToRoute, getAdminAccess } = require("../middlewares/authorization/auth");
const {checkUserExist} = require("../middlewares/database/databaseErrorHelpers")
const {blockUser,deleteUser} = require("../controllers/admin");
const router = express.Router();

router.use ([getAccessToRoute,getAdminAccess]);
router.get("/",(req,res,next) =>{
    res.status(200)
    .json({
        success : true,
        message : "Admin Page"
    })
}) 
router.put("/block/:userid",checkUserExist,blockUser);
router.delete("/delete/:userid",checkUserExist,deleteUser);
module.exports = router;