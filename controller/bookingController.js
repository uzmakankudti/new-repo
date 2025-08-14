import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Booking from "../schemas/bookingSchema.js";
import { getPassengerGender } from "./sleeperRule.js";

const HOLD_MINUTES = 12;

/* export const createBooking = asyncHandler(async (req, res) => {
    try {
        const { bus,
            passenger,
            routes,
            journeyDate,
            seatCode,
            slotLabel,
            paymentMethod,
            totalAmt,
            status } = req.body;
        if (!bus || !passenger || !routes || !journeyDate || !seatCode || !slotLabel) {
            return res.status(400).json({
                success: false,
                message: "bus, passenger, routes, journeyDate, and seatCode are required",
            });
        }



        // 1) Get passenger gender
        const passengerGender = await getPassengerGender(passenger);

        // 2) Sleeper same-gender rule: check sibling slot on the same seat
        const siblingLabel = slotLabel === "A" ? "B" : "A";
        const jd = new Date(journeyDate);

        const sibling = await SeatAllocation.findOne({
            bus,
            routes,
            journeyDate: jd,
            seatCode,
            slotLabel: siblingLabel,
        }).lean();

        // If sibling slot exists AND has an occupantGender set, enforce same gender
        if (sibling?.occupantGender && sibling.occupantGender !== passengerGender) {
            return res.status(400).json({
                success: false,
                message: "Sleeper rule: if one slot is female, the other slot must also be female.",
            });
        }

        const newBooking = await Booking.create({ bus, passenger, routes, journeyDate, seatCode, slotLabel, paymentMethod, totalAmt, status })
        return res.status(201).json({
            success: true,
            message: "booking added successfully",
            data: newBooking
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "server error",
        });
    }
}); */


export const createBooking = asyncHandler(async (req, res) => {
  try {
    const {
      bus, passenger, routes,
      journeyDate, seatCode, slotLabel,
      paymentMethod, totalAmt, status
    } = req.body;

    // 1) Basic checks
    if (!bus || !passenger || !routes || !journeyDate || !seatCode || !slotLabel) {
      return res.status(400).json({
        success: false,
        message: "bus, passenger, routes, journeyDate, seatCode, slotLabel are required",
      });
    }

    // 2) Validate IDs (if they’re ObjectId refs)
    for (const [k, v] of Object.entries({ bus, passenger, routes })) {
      if (!mongoose.isValidObjectId(v)) {
        return res.status(400).json({ success: false, message: `Invalid ObjectId for ${k}` });
      }
    }

    // 3) Normalize date to 00:00:00 so equality works
    const jd = new Date(journeyDate);
    if (isNaN(jd.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid journeyDate" });
    }
    jd.setHours(0, 0, 0, 0);

    // 4) Normalize slot label
    const slot = String(slotLabel).toUpperCase() === "A" ? "A" : "B";
    const siblingLabel = slot === "A" ? "B" : "A";

    // 5) Resolve requester gender (normalize to uppercase)
    const g = await getPassengerGender(passenger);
    const requesterGender = String(g || "").toUpperCase(); // "MALE" | "FEMALE" | "OTHER"
    if (!requesterGender) {
      return res.status(400).json({ success: false, message: "Could not resolve passenger gender" });
    }

    // 6) Find sibling booking (same bus/routes/date/seat, other slot)
    const siblingBooking = await Booking.findOne({
      bus,
      routes,
      journeyDate: jd,     // same normalized date saved below
      seatCode,
      slotLabel: siblingLabel,
      status: { $ne: "CANCELLED" }, // ignore cancelled
    }).lean();

    if (siblingBooking) {
      const sibGenderRaw = await getPassengerGender(siblingBooking.passenger);
      const siblingGender = String(sibGenderRaw || "").toUpperCase();

      if (siblingGender !== requesterGender) {
        return res.status(400).json({
          success: false,
          message:
            "Sleeper rule: adjacent slots must match gender (if one slot is female, the other must also be female).",
          debug: { siblingSlot: siblingLabel, siblingGender, requesterGender } // remove later
        });
      }
    }

    // 7) Create booking (store normalized date & slot)
    const newBooking = await Booking.create({
      bus,
      passenger,
      routes,
      journeyDate: jd,
      seatCode,
      slotLabel: slot,
      paymentMethod,
      totalAmt,
      status: status || "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "booking added successfully",
      data: newBooking,
    });
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

export const confirmBooking = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "booking ID required",
            });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "booking not found",
            });
        }

        booking.status = "CONFIRMED";
        await booking.save();

        return res.status(200).json({
            success: true,
            message: "booking confirmed successfully",
            data: booking,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "server error while confirming booking",
        });
    }
});

export const cancelBooking = asyncHandler(async (req, res) => {
    try {
        const { bookingId } = req.params;
        const updates = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updates, { new: true })
        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: "booking not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Booking confirmed successfully",
            data: updatedBooking,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error"
        });
    }
});