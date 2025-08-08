import express, { Router } from "express";
import{ 
    addRoute, 
    deleteRoute, 
    getAllRoutes,
    getRouteById,
    updateRoute
}from "../controller/routesController.js";

const routesRouter = express.Router();
routesRouter.route("/addRoute").post(addRoute);
routesRouter.route("/getAllRoutes").get(getAllRoutes);
routesRouter.route("/getRouteById/:routeId").get(getRouteById);
routesRouter.route("/updateRoute/:routeId").put(updateRoute);
routesRouter.route("/deleteRoute/:routeId").delete(deleteRoute);
export default routesRouter;