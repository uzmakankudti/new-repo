import Passenger from "../schemas/passengerSchema.js";
import User from "../schemas/userSchema.js";
import asyncHandler from "express-async-handler";

export const createPassenger = async (req, res) => {
  try {
    const passenger = await Passenger.create(req.body);
    res.status(201).json({
      success: true,
      data: passenger
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// READ ALL (raw docs only)
export const getAllPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.find({}, "-__v");
    res.json({
      success: true,
      data: passengers
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// READ ONE (raw doc only)
export const getPassengerById = async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id, "-__v"); // no populate
    if (!passenger) return res.status(404).json({
      success: false,
      message: "Passenger not found"
    });
    res.json({
      success: true,
      data: passenger
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// UPDATE
export const updatePassenger = async (req, res) => {
  try {
    const passenger = await Passenger.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, projection: "-__v" }
    );
    if (!passenger) return res.status(404).json({
      success: false,
      message: "Passenger not found"
    });
    res.json({
      success: true,
      data: passenger
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// DELETE
export const deletePassenger = async (req, res) => {
  try {
    const passenger = await Passenger.findByIdAndDelete(req.params.id);
    if (!passenger) return res.status(404).json({
      success: false,
      message: "Passenger not found"
    });
    res.json({
      success: true,
      message: "Passenger deleted"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};