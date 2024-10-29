const mongoose = require("mongoose");
const bcrypt=require('bcryptjs')
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "Password must be 6 characters"],
    },
    cartItem: {
      quantity: {
        type: Number,
        default: 1,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
)
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    try {
        const salt=await bcrypt.genSalt(10)
        this.password=await bcrypt.hash(this.password,salt)
        next()
    } catch (error) {
        next(error)
    }
    
})

userSchema.method.comparePassword=async function(password) {
    return  await bcrypt.compare(password, this.password)
    
}

module.exports=mongoose.model("User",userSchema)