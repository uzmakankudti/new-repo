import mongoose from "mongoose";
const busSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    number:{
        type:String,
        unique:true,
        required:true,
    },
    seatType:{
        type:String,
        enum:["SLEEPER","SEATER"],
        required:true,
    },
});
const Bus=mongoose.model("bus",busSchema);
export default Bus;