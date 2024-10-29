const express =require("express");
const { protectRoute } =require("../middleware/auth.middleware.js");
const { getCoupon, validateCoupon } =require("../controllers/coupon.controller.js");

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);

module.exports=router