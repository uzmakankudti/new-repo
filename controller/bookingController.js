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

