import express from "express";
import{
    
    addUser,
    deleteUser,
    findGender,
    getUserById,
    listAllUser,
    updateUser,
}from "../controller/userController.js";

const userRouter = express.Router();
userRouter.route("/addUser").post(addUser);
userRouter.route("/listAllUser").get(listAllUser);
userRouter.route("/findGender").get(findGender);
userRouter.route("/updateUser/:userId").put(updateUser);
userRouter.route("/getUserById/:userId").get(getUserById);
userRouter.route("/deleteUser/:userId").delete(deleteUser);
export default userRouter;