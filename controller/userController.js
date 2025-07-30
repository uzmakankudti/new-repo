import User from "../schemas/userSchema.js";
import Passenger from "../schemas/passengerSchema.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

export const addUser = asyncHandler(async (req, res) => {
  try {
    const { userName, phoneNumber, address, email, password, gender, role } =
      req.body;
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        msg: "user already exists",
      });
    }

    const user = await User.create({
      userName,
      phoneNumber,
      address,
      email,
      password,
      gender,
      role,
    });
    return res.status(201).json({
      success: true,
      message: "user created successfully",
      user: {
        id: user._id,
        userName: user.userName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        email: user.email,
        password: user.password,
        gender: user.gender,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "server error",
      error,
    });
  }
});

export const listAllUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.find({});
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      msg: "not found",
    });
  }
});

export const findGender = asyncHandler(async (req,res)=>{
    try{
        const maleCount=await user.count({gender:"MALE"});
        const femaleCount=await user.count({gender:"FEMALE"});
        const otherCount=await user.count({gender:"OTHER"});
        return res.status(400).json({
            success:true,
            msg:"ok",
        });
    }catch(error){
        return res.status(500).json({
            msg:"internal server error"
        })
    }
})
