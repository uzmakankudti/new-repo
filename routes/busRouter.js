import express from "express";
import{ 
    addbus, 
    deleteBus, 
    getAllBuses,
    getBusById,
    updateBus,
}from "../controller/busController.js";

const busRouter = express.Router();
busRouter.route("/addbus").post(addbus);
busRouter.route("/all").get(getAllBuses);
busRouter.route("/getBusById/:busId").get(getBusById);
busRouter.route("/updateBus/:busId").put(updateBus);
busRouter.route("/deleteBus/:busId").delete(deleteBus)
export default busRouter;