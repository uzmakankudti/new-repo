import userRouter from "./userRoutes.js";
import busRouter from "./busRouter.js";
import express from "express"
import routesRouter from "./routesRouter.js";
const router = express.Router();
router.use("/user", userRouter);
router.use("/bus",busRouter);
router.use("/route",routesRouter);
export default router;