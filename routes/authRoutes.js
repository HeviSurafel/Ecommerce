const express = require("express");
const router = express.Router();
const {protectRoute}=require("../middleware/auth.middleware")
const {signUp,login,logout,refreshToken,getProfile}=require('../controllers/auth.controller')
router.post("/signup", signUp);
router.post("/login",login);
router.post("/logout",logout);
router.post("/refresh-token",refreshToken)
router.get("/profile",protectRoute,getProfile)
module.exports = router;
