import express from "express";

import{
      confirmBooking,
      createBooking, 
      updateBooking}from "../controller/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.route("/createBooking").post(createBooking);
bookingRouter.route("/confirmBooking/:bookingId").post(confirmBooking);
bookingRouter.route("/updateBooking/:bookingId").post(updateBooking);

export default bookingRouter;