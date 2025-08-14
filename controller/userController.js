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
      data:user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      msg: "not found",
    });
  }
});

export const countGender = asyncHandler(async (req,res)=>{
    try{
        const maleCount=await User.countDocuments({gender:"MALE"});
        const femaleCount=await User.countDocuments({gender:"FEMALE"});
        const otherCount=await User.countDocuments({gender:"OTHER"});
        return res.status(200).json({
            success:true,
            msg:"gender count fetched",
            data:{
              MALE:maleCount,
              FEMALE:femaleCount,
              OTHER:otherCount,
            },
        });
    }catch(error){
        return res.status(500).json({
            msg:"internal server error",
            error:error.message,
        });
    }
});

export const updateUser=asyncHandler(async(req,res)=>{
  const {userId}=req.params;
  const updateData=req.body;
  
  const user=await User.findById(userId);
  if(!user){
    return res.status(404).json({
      success:false,
      message:"user not found"
    });
  }
 
  user.userName=updateData.userName||user.userName;
  user.email=updateData.email||user.email;
  user.phoneNumber=updateData.phoneNumber||user.phoneNumber;
  
  const updatedUser = await user.save();
  res.status(200).json({
     success: true, 
     data: updatedUser
  });
});

export const getUserById=asyncHandler(async(req,res)=>{
  const {userId}=req.params;
  const user=await User.findById(userId);
  if(!user){
    return res.status(404).json({
      success:false,
      message:"user not found",
    });
  }
  return res.status(200).json({
    success:true,
    message:"user found with this id",
    data:user,
  });
});

export const deleteUser= asyncHandler(async(req,res)=>{
  const {userId}=req.params;
  try{
    const user=await User.findById(userId);
    if(!user){
      return res.status(404).json({
        success:false,
        message:"user not found",
      });
    }
    await user.deleteOne();
    
    return res.status(200).json({
      success:true,
      message:"User delete successfully",
  });

  }catch(error){
    return res.status(500).json({
      success:false,
      message:"internal server error",
      error:error.message,
    });
  }
 });


/*
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  await user.deleteOne(); // or: await User.findByIdAndDelete(userId);

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
*/