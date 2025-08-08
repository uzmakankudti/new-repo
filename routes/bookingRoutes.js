import express from "express";
import{
     createBooking 
}from "../controller/bookingController.js";

const bookingRoutes = express.Router();
bookingRoutes.route("/createBooking").post(createBooking);
export default bookingRoutes;