const express =require("express");
const { adminRoute, protectRoute } =require("../middleware/auth.middleware.js");
const { getAnalyticsData, getDailySalesData } =require("../controllers/analytics.controller.js");
const { RouterIcon } = require("lucide-react");

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
	try {
		const analyticsData = await getAnalyticsData();

		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		const dailySalesData = await getDailySalesData(startDate, endDate);

		res.json({
			analyticsData,
			dailySalesData,
		});
	} catch (error) {
		console.log("Error in analytics route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

module.exports=router