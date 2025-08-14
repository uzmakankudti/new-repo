import express from "express";

import{
      cancelBooking, 
      confirmBooking,
      createBooking }from "../controller/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.route("/createBooking").post(createBooking);
bookingRouter.route("/confirmBooking/:bookingId").post(confirmBooking);
bookingRouter.route("/cancelBooking/:bookingId").post(cancelBooking);

export default bookingRouter;