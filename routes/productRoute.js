const express =require("express");
const {

	getAllProducts,getFeaturedProducts,createProduct,
	deleteProduct,getRecommendedProducts,getProductsByCategory,toggleFeaturedProduct
	
} =require("../controllers/product.controller.js");
const { adminRoute, protectRoute } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

module.exports=router