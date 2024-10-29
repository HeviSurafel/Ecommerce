const express =require( "express");
const { protectRoute } =require( "../middleware/auth.middleware.js");
const { checkoutSuccess, createCheckoutSession } =require( "../controllers/payment.controller.js");

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);

module.exports=router