import express from "express";
import {
  createPassenger,
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  deletePassenger
} from "../controller/passengerController.js";

const passengerRouter = express.Router();

passengerRouter.route("/createPassenger").post(createPassenger);
passengerRouter.route("/getAllPassengers").get(getAllPassengers);
passengerRouter.route("/getPassengerById/:id").get(getPassengerById);
passengerRouter.route("/updatePassenger/:id").put(updatePassenger);
passengerRouter.route("/deletePassenger/:id").delete(deletePassenger);

export default passengerRouter;
