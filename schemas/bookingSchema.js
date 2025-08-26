import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus",
        required: true,
    },
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Passenger",
        required: true,
    },
    routes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Routes",
        required: true,
    },

    journeyDate: {
        type: Date,
        required: true
    },
    seatCode: {
        type: String,
        required: true
    },
    slotLabel: {
        type: String,
        enum: ["A", "B"],
        required: true
    },
     seatType:{
        type:String,
        enum:["SLEEPER","SEATER"],
        required:true,
    },

    paymentMethod: {
        type: String,
        enum: ["CASH", "UPI", "CARD"],
        default: "CASH",
        required: true,
    },
    totalAmt: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["CONFIRMED", "CANCELLED", "PENDING"],
        default: "PENDING",
    },
}, { timestamps: true });

const Booking = mongoose.model("booking", bookingSchema);
export default Booking;

//export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
