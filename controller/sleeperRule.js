// controller/sleeperRule.js

import SeatAllocation from "../schemas/seatAllocationSchema.js";
import Passenger from "../schemas/passengerSchema.js";
import User from "../schemas/userSchema.js";

export async function getPassengerGender(passengerId) {
  const passenger = await Passenger.findById(passengerId).lean();
  if (!passenger) throw new Error("Passenger not found");
  const user = await User.findById(passenger.user).lean();
  if (!user) throw new Error("User not found for passenger");
  return user.gender; // "MALE" | "FEMALE" | "OTHER"
}

// Enforce: if one slot is female, the other slot must be female (same-seat A/B).
export async function assertSleeperSameGenderRule({
  bus,
  routes,
  journeyDate,
  seatCode,
  slotLabel,
  passengerGender,
}) {
  const siblingLabel = slotLabel === "A" ? "B" : "A";
  const jd = new Date(journeyDate); // normalize

  const sibling = await SeatAllocation.findOne({
    bus,
    routes,
    journeyDate: jd,
    seatCode,
    slotLabel: siblingLabel,
  }).lean();

  // If sibling empty (no doc or no gender), allow.
  if (!sibling || !sibling.occupantGender) return;

  // If sibling occupied → must match gender
  if (sibling.occupantGender !== passengerGender) {
    throw new Error("Rule: second slot must match first occupant's gender for sleeper seats.");
  }
}
