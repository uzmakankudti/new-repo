import express from "express";
import{
    addUser,
    findGender,
    listAllUser,
}from "../controller/userController.js";

const userRouter = express.Router();
userRouter.route("/addUser").post(addUser);
userRouter.route("/listAllUser").get(listAllUser);
userRouter.route("/findGender").get(findGender);
export default userRouter;