import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Booking from "../schemas/bookingSchema.js";
import Passenger from "../schemas/passengerSchema.js"; // ✅ ADDED
import { getPassengerGender } from "./sleeperRule.js";



/*export const createBooking = asyncHandler(async (req, res) => {
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
        return res.status(400).json({
          success: false,
          message: `Invalid ObjectId for ${k}`
        });
      }
    }

    // 3) Normalize date to 00:00:00 so equality works
    const jd = new Date(journeyDate);
    if (isNaN(jd.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid journeyDate"
      });
    }
    jd.setHours(0, 0, 0, 0);

    // 4) Normalize slot label
    const slot = String(slotLabel).toUpperCase() === "A" ? "A" : "B";
    const siblingLabel = slot === "A" ? "B" : "A";

    // 5) Resolve requester gender (normalize to uppercase)
    const gender = await getPassengerGender(passenger);
    const requesterGender = String(gender || "").toUpperCase(); // "MALE" | "FEMALE" | "OTHER"
    if (!requesterGender) {
      return res.status(400).json({ success: false, message: "Could not resolve passenger gender" });
    }

    //CHANGES ADDED 
    const passengerDoc = await Passenger.findById(passenger).lean();
    if (!passengerDoc) {
      return res.status(404).json({
        success: false,
        message: "Passenger not found"
      });
    }

    const isSleeper = passengerDoc.seatType === "SLEEPER";

    // 6) Find sibling booking (same bus/routes/date/seat, other slot)
   
    if(isSleeper){
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
          //debug: { siblingSlot: siblingLabel, siblingGender, requesterGender } // remove later
        });
      }
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
});*/

export const createBooking = asyncHandler(async (req, res) => {
  try {
    const {
      bus,
      passenger,
      routes,
      journeyDate,
      seatCode,
      slotLabel,
      paymentMethod,
      totalAmt,
      status,
      seatType,
    } = req.body;

    // 1) Required fields
    if (!bus || !passenger || !routes || !journeyDate || !seatCode || !slotLabel || !seatType) {
      return res.status(400).json({
        success: false,
        message: "bus, passenger, routes, journeyDate, seatCode, slotLabel,seatType are required",
      });
    }

    // 2) Validate IDs
    for (const [k, v] of Object.entries({ bus, passenger, routes })) {
      if (!mongoose.isValidObjectId(v)) {
        return res.status(400).json({ success: false, message: `Invalid ObjectId for ${k}` });
      }
    }

    // 3) Normalize date to midnight
    const jd = new Date(journeyDate);
    if (isNaN(jd.getTime()))
      return res.status(400).json({ success: false, message: "Invalid journeyDate" });
    jd.setHours(0, 0, 0, 0);

    // 4) Seat code must be s1..s50 
    const m = /^s(\d+)$/i.exec(String(seatCode));
    if (!m) return res.status(400).json({ success: false, message: "seatCode must be s1..s50" });
    const num = parseInt(m[1], 10);
    if (num < 1 || num > 50)
      return res.status(400).json({ success: false, message: "Only seatCode s1..s50 allowed" });
    const seat = `s${num}`;

    // 5) Slot must be A or B, normalize to uppercase
    const slot = String(slotLabel).toUpperCase();
    if (slot !== "A" && slot !== "B") {
      return res.status(400).json({ success: false, message: "slotLabel must be A or B" });
    }
    const siblingSlot = slot === "A" ? "B" : "A";

    // 6) Seat type: validate or auto-derive
   //  s1..s42 = SLEEPER, s43..s50 = SEATER 
    let _seatType = (seatType || "").toString().trim().toUpperCase();
    if (!_seatType) {
      _seatType = num <= 42 ? "SLEEPER" : "SEATER"; // <-- default mapping; change if your bus layout differs
    }
    if (!["SLEEPER", "SEATER"].includes(_seatType)) {
      return res.status(400).json({ success: false, message: "seatType must be SLEEPER or SEATER" });
    }

    // 7) Load passenger & requester gender
    const passengerDoc = await Passenger.findById(passenger).lean();
    if (!passengerDoc) {
      return res.status(404).json({ success: false, message: "Passenger not found" });
    }
    const requesterGender = String(await getPassengerGender(passenger)).toUpperCase(); // e.g., "MALE"/"FEMALE"

    // 8) Sleeper rule: A & B must be same gender (if sibling slot is already booked & not cancelled)
    if (_seatType === "SLEEPER") {
      const sibling = await Booking.findOne({
        bus,
        routes,
        journeyDate: jd,
        seatCode: seat,
        slotLabel: siblingSlot,
        status: { $ne: "CANCELLED" },
      }).lean();

      if (sibling) {
        const siblingGender = String(await getPassengerGender(sibling.passenger)).toUpperCase();
        if (siblingGender !== requesterGender) {
          return res.status(400).json({
            success: false,
            message: "Sleeper rule: Paired berth (A/B) must be same gender.",
          });
        }
      }
    }

    // 9) Block duplicate seat+slot (unless cancelled)
    const already = await Booking.findOne({
      bus,
      routes,
      journeyDate: jd,
      seatCode: seat,
      slotLabel: slot,
      status: { $ne: "CANCELLED" },
    }).lean();
    if (already) {
      return res.status(409).json({ success: false, message: "This seat+slot is already booked." });
    }

    // 10) Create booking
    const created = await Booking.create({
      bus,
      passenger,
      routes,
      journeyDate: jd,
      seatCode: seat,
      slotLabel: slot,
      paymentMethod,
      totalAmt,
      seatType: _seatType,
      status: status || "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Booking added successfully",
      data: created,
    });
  } catch (err) {
    console.error("createBooking error:", err);
    return res.status(500).json({ success: false, message: "server error", err: err.message });
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

export const updateBooking = asyncHandler(async (req, res) => {
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
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error"
    });
  }
});