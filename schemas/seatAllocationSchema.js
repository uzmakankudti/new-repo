// schemas/seatAllocationSchema.js
import mongoose, { Schema } from "mongoose";

const seatAllocationSchema = new mongoose.Schema(
  {
    bus: { type: Schema.Types.ObjectId, ref: "bus", required: true, index: true },
    routes: { type: Schema.Types.ObjectId, ref: "routes", required: true, index: true },
    journeyDate: { type: Date, required: true, index: true },

    seatCode: { type: String, required: true },                 // e.g. "S12"
    slotLabel: { type: String, enum: ["A", "B"], required: true },

    status: { type: String, enum: ["FREE", "HOLD", "CONFIRMED"], default: "FREE" },
    occupantBookingId: { type: Schema.Types.ObjectId, ref: "Booking", default: null },     // ⬅ match controller
    occupantPassengerId: { type: Schema.Types.ObjectId, ref: "Passenger", default: null }, // ⬅ match controller
    occupantGender: { type: String, enum: ["MALE", "FEMALE", "OTHER", ], default: null },

    holdUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

seatAllocationSchema.index(
  { bus: 1, routes: 1, journeyDate: 1, seatCode: 1, slotLabel: 1 },
  { unique: true }
);

const SeatAllocation = mongoose.model("seat_allocation", seatAllocationSchema);
export default SeatAllocation;
