import Bus from "../schemas/busSchema.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

export const addbus=asyncHandler(async(req,res)=>{
    try{
        const{name, number}=req.body;
        const existingBus=await Bus.findOne({number});
        if(existingBus){
            return res.status(400).json({
                success:false,
                message:"bus number already exists",
                data:existingBus,
            });
        }
        const newBus=await Bus.create({name,number});
        return res.status(201).json({
            success:true,
            data:newBus,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"server error",
            error:error.message
        });
    }
});

export const getAllBuses=asyncHandler(async(req,res)=>{
    try{
        const buses=await Bus.find();
        res.status(200).json({
            success:true,
            message:"all buses information",
            data:buses
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"server error",
            error:error.message
        });
    }
});

export const getBusById=asyncHandler(async(req,res)=>{
    try{
    const{busId}=req.params;
    const bus=await Bus.findById(busId);
    if(!bus){
        return res.status(404).json({
            success:false,
            message:"bus not found"
        });
    }return res.status(200).json({
        success:true,
        data:bus,
    });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"server error"
        });
    }  
});

export const updateBus=asyncHandler(async(req,res) => {
    try{
        const{busId}=req.params;
        const updates=req.body;
        const bus=await Bus.findByIdAndUpdate(busId,updates,{new:true});
        if(!bus){
            return res.status(404).json({
                success:false,
                message:"bus not found",
            });
            }return res.status(200).json({
                success:true,
                data:bus,
            });
        }catch(error){
             return res.status(500).json({
                success:false,
                message:"server error",
                error:error.message
            });
        }
});

export const deleteBus=asyncHandler(async(req,res)=>{
    try{
        const{busId}=req.params;
        const bus=await Bus.findByIdAndDelete(busId);
        if(!bus){
            return res.status(404).json({
                success:false,
                message:"there is no such bus existing"
            });
        }return res.status(200).json({
            success:true,
            message:"this bus is no longer available"
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"server error",
            error:error.message
        });
    }
});