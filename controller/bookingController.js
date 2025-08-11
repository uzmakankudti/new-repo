import Booking from "../schemas/bookingSchema.js";
import Bus from "../schemas/busSchema.js"
import Passenger from "../schemas/passengerSchema.js";
import Routes from "../schemas/routes.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";


export const createBooking = asyncHandler(async (req, res) => {
    try {
        const {
            bus,
            passenger,
            routes,
            paymentMethod = "CASH",
            totalAmt,
            status
        } = req.body;

        // Validate required fields
        if (!bus || !passenger || !routes || typeof totalAmt !== "number") {
            return res.status(400).json({
                success: false,
                message: "bus, passenger, routes and totalAmt are required"
            });
        }

        // Create booking
        const booking = await Booking.create({
            bus,
            passenger,
            routes,
            paymentMethod,
            totalAmt,
            status
        });

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating booking",
            error: error.message
        });
    }
});

export const getAllBookings=asyncHandler(async(req,res)=>{
    try{
        const bookings=await Booking.find();
        
        if(!bookings){
            return res.status(404).json({success: false, msg:"Bookings Not found"})
        }
        return res.status(200).json({
            success:true,
            message:"all the bookings data",
            data:bookings
        });
        /*
        .populate("bus")
        .populate("routes");
        res.json(bookings);
        */
    }catch(error){
        return res.status(500).json({
            success:false,
            error:error.message
        });
    }
});

export const getBookingById=asyncHandler(async(req,res)=>{
    try{
        const{bookingId}=req.params;
        const booking=await Booking.findById(bookingId);
        if(!bookingId){
            return res.status(404).json({
                success:false,
                message:"booking not found",
            });
        }return res.status(200).json({
            success:true,
            message:"booking details",
            data:booking
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"server error"
        });
    }
});

export const updateBooking=asyncHandler(async(req,res) => {
    try{
        const{bookingId}=req.params;
        const updates=req.body;
        const bus=await Bus.findByIdAndUpdate(bookingId,updates,{new:true});
        if(!bookingId){
            return res.status(404).json({
                success:false,
                message:"booking not found",
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