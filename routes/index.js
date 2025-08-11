import userRouter from "./userRouter.js";
import busRouter from "./busRouter.js";
import express from "express"
import routesRouter from "./routesRouter.js";
import bookingRouter from "./bookingRouter.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/bus",busRouter);
router.use("/route",routesRouter);
router.use("/booking",bookingRouter);

export default router;