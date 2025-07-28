import mongoose from 'mongoose';
const userSchema=mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        unique:true,
        required:true,
    },
    gender:{
        type:String,
        enum:["FEMALE","MALE","OTHER"],
        required:true,
    },
     role:{
        type:String,
        enum:["ADMIN","PASSENGER"],
        required:true,
    },
});
const User=mongoose.model("user",userSchema);
export default User;
