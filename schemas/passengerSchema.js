import mongoose from "mongoose";
const passengerSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    user:{type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
});

const Passenger=mongoose.model("passenger",passengerSchema);
export default Passenger;

//export default mongoose.models.Passenger || mongoose.model("Passenger", passengerSchema);