import mongoose from "mongoose";
const bookingSchema=new mongoose.Schema({
    bus:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bus",
        required:true,
    },
    passenger:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Passenger",
        required:true,
    },
    routes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Routes",
        required:true,
    },
    paymentMethod:{
        type:String,
        enum:["CASH","UPI","CARD"],
        default:"CASH",
        required:true,
    },
    totalAmt:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:["CONFIRMED","CANCELLED","PENDING"],
        default:"PENDING",
    },
},{timestamps:true});
const Booking=mongoose.model("booking",bookingSchema);
export default Booking;

