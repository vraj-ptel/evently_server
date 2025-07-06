import User from "../models/userModel.js";
import customError from "../utils/errorClass.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req, res, next) => {
  try {
    console.log("req body", req.body);
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return next(new customError("All fields are required", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    return res
      .status(201)
      .json({ user: { _id: user._id, name, email }, token });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return next(new customError(`${duplicateField} already exists`, 400));
    }

    return next(new customError(error.message || "error creating user", 500));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new customError("All fields are required", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new customError("Invalid credentials", 400));
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(new customError("Invalid Password", 400));
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    return res
      .status(201)
      .json({ user: { _id: user._id, name: user.name, email }, token });
  } catch (error) {
    console.log("error in login");
    return next(new customError(error.message || "error login user", 500));
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const adminSecretKey = process.env.ADMIN_SECRET_KEY || "evently";
    const { secretKey } = req.body;
    const isMatch = secretKey === adminSecretKey;
    if (!isMatch) {
      return next(new customError("invalid admin key", 401));
    } else {
      const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });
      res
        .status(200)
        .json({
          success: true,
          message: "admin login successfully",
          token,
        });
    }
  } catch (error) {
    return next(new customError(error.message || "error login admin", 500));
  }
};

export const getUserDetail=async(req,res,next)=>{
    try {
      const reqId=req.userId;
      if(!reqId){
        return next(new customError("User not found",404));
      }
      const user=await User.findById(reqId);
      res.status(200).json({success:true,user})
    } catch (error) {
      return next(new customError(error.message || "error login admin", 500));
    }
}

export const validUserOrNot=async(req,res,next)=>{
     try {
      const reqId=req.userId;
      if(!reqId){
        return next(new customError("not valid user",404));
      }
      res.status(200).json({success:true,message:"valid user"})
    } catch (error) {
      return next(new customError(error.message || "error login admin", 500));
    }
}

export const isAdminVerified=async(req,res,next)=>{
  if(req.isAdmin){
    return res.status(200).json({success:true,message:"admin verified successfully"});
  }
  else{
    return next(new customError("not valid admin",404));
  }
}