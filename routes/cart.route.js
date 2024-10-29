const express =require("express");
const { addToCart, getCartProducts, removeAllFromCart, updateQuantity } =require("../controllers/cart.controller.js");
const { protectRoute } =require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeAllFromCart);
router.put("/:id", protectRoute, updateQuantity);
module.exports=router