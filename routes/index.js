import userRouter from "./userRouter.js";
import busRouter from "./busRouter.js";
import express from "express"
import routesRouter from "./routesRouter.js";
import bookingRouter from "./bookingRouter.js";
import passengerRouter from "./passengerRouter.js";


const router = express.Router();

router.use("/user", userRouter);
router.use("/bus",busRouter);
router.use("/route",routesRouter);
router.use("/booking",bookingRouter);
router.use("/passengers", passengerRouter);

export default router;