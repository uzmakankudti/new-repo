import userRouter from "./userRoutes.js";
const router = expressRouter();
router.use("/user", userRouter);
