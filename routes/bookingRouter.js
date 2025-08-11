import express from "express";
import{
     createBooking, 
     getAllBookings,
     getBookingById,
     updateBooking
}from "../controller/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.route("/createBooking").post(createBooking);
bookingRouter.route("/getAllBookings").get(getAllBookings);
bookingRouter.route("/getBookingById/:bookingId").get(getBookingById);
bookingRouter.route("/updateBooking/:bookingId").put(updateBooking);

export default bookingRouter;