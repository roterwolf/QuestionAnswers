const express = require("express");
const {getAllAut} = require("../controllers/auth");
const {register,
    login,
    logout,
    getUser,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
} = require("../controllers/auth");
const {getAccessToRoute} = require ("../middlewares/authorization/auth")
const profileImageUpload = require("../middlewares/libraries/profileImageUpload");
const router = express.Router();

// api/auth  
// api/auth/register  yazıldığında buraya yönlenmesi gerek

router.get("/",getAllAut);
router.get("/profile",getAccessToRoute, getUser);
router.post("/login", login);
router.post("/logout", getAccessToRoute, logout);
router.post("/register", register);
router.post("/upload",[getAccessToRoute,profileImageUpload.single("profile_image")],imageUpload);
router.post("/forgotpassword",forgotPassword);
router.post("/resetpassword",resetPassword);
router.put("/edit",getAccessToRoute,editDetails);
// router.get("/",(req,res) =>{    
//     res.status(200).json({success : true, data: "Auth Home Page"});
// })

// router.get("/register",(req,res) =>{
//     res.send("Auth Register Page");
// })

module.exports = router;