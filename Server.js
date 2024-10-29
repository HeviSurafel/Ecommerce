const express = require("express");
const dotenv = require("dotenv").config();
const Port = process.env.PORT || 5000;
const cors=require("cors")
const cookieParser=require("cookie-parser")
//database connection
const databaseConnection=require('./lib/db')
//authentication route
const authRoutes=require('./routes/authRoutes')
const productRoute=require("./routes/productRoute")
const cartRoute=require("./routes/cart.route")
const couponRoute=require("./routes/coupon.route")
const paymentRoutes=require("./routes/payment.route")
const analyticsRoutes=require("./routes/analytics.route")

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser())
app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/products",productRoute)
app.use("/api/cart",cartRoute)
app.use("/api/coupon",couponRoute)
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.listen(Port, () => {
    databaseConnection(),
  console.log(`Server is running on http://localhost ${Port} `);
});
