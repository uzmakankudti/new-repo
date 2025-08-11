import mongoose from "mongoose";
const routesSchema=mongoose.Schema({
    from:{
        type:String,
        required:true,
    },
    to:{
        type:String,
        required:true,
    },
});

const Routes=mongoose.model("routes",routesSchema);
export default Routes;

//export default mongoose.models.Routes || mongoose.model("Routes", routesSchema);
