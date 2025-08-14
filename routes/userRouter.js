import express from "express";
import{
    
    addUser,
    countGender,
    deleteUser,
    getUserById,
    listAllUser,
    updateUser,
}from "../controller/userController.js";

const userRouter = express.Router();
userRouter.route("/addUser").post(addUser);
userRouter.route("/listAllUser").get(listAllUser);
userRouter.route("/countGender").get(countGender);
userRouter.route("/updateUser/:userId").put(updateUser);
userRouter.route("/getUserById/:userId").get(getUserById);
userRouter.route("/deleteUser/:userId").delete(deleteUser);
export default userRouter;