const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const redis = require("../lib/redis");
const bcrypt=require('bcryptjs')
const asyncHandler=require('express-async-handler')
const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.accessTokeSecret, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.refreshTokenSecret, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token : ${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};
const setCokkies = async (res, refreshToken, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevent CSRF attack
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevent CSRF attack
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  const userExist = await User.findOne({ email });
  try {
    if (userExist) {
      return res.status(400).json({ message: "user already exist" });
    }
    //store user to database
    const user = await User.create({ name, email, password });
    // create authenticator
    const { accessToken, refreshToken } = generateToken(User._id);

    //seting up cookies
    setCokkies(res, accessToken, refreshToken);
    await storeRefreshToken(user._id, refreshToken);
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "user created successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
const login = (async (req, res) => {
  const { email, password } = req.body;
   try {
    const user = await User.findOne({ email });
    const isPasswordRight = await bcrypt.compare(password, user.password);
    if (user && isPasswordRight) {
      const { accessToken, refreshToken } = generateToken(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCokkies(res, accessToken, refreshToken);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.password,
        role: user.role,
      })
    }
    else{
     
      res.status(501).json({
        message:"email or password error"
      })
    }
   } catch (error) {
    console.log(error)
   }
  
  
});
const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (refreshToken) {
      const decode = jwt.verify(refreshToken, process.env.refreshTokenSecret);
      res.status(200).json({ decode });
      await redis.del(`refresh_token: ${decode.userId}`);
    }
    res.clearCookie("accessToken"),
      res.clearCookie("refreshToken"),
      res.json({ message: "logout successfully" });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};
const refreshToken=async(req,res)=>{
  try {
    const refreshToken=req.cookie.refreshToken;
    if(!refreshToken){
      res.status(401).json({
        message:"no Token found"
      })
    }
    const decoded=jwt.verify(refreshToken,process.env.refreshTokenSecret)
    console.log(decoded)
    const storedToken=await redis.get(`refresh_token : ${decoded.userId}`)
    if(decoded!==storedToken){
      return res.status(401).json({
        message:"Invalid refresh token"
      })
    }
    const accessToken=jwt.sign({userId:decoded.userId},process.env.accessTokeSecret,{
      expiresIn:"15m"
    })
    res.cookie("accessToken", accessToken, {
      httpOnly:true,
      secure:process.env.NODE_ENV==="production",
      sameSite:"strict",
      maxAge:15*60*1000,
    })
    res.json({message: "refresh token created"})
  } catch (error) {
    console.log(error)
  }
}
const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

module.exports = { signUp, login, logout ,refreshToken,getProfile};
