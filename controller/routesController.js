import Routes from "../schemas/routes.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

export const addRoute = asyncHandler(async (req, res) => {
    try {
        const { from, to } = req.body;
        const newRoute = await Routes.create({ from, to });
        return res.status(201).json({
            success: true,
            message: "Route created successfully",
            data: newRoute
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "failed to create route",
            error: error.message
        });
    }
});

export const getAllRoutes = asyncHandler(async (req, res) => {
    try {
        const routes = await Routes.find();
        return res.status(200).json({
            success: true,
            data: routes,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to fetch routes",
            error: error.message
        });
    }
});

export const getRouteById = asyncHandler(async (req, res) => {
    try {
        const { routeId } = req.params;
        const route = await Routes.findById(routeId);
        if (!route) {
            return res.status(404).json({
                success: false,
                message: "route not found"
            });
        } return res.status(200).json({
            success: true,
            message: "all routes",
            data: route
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to fetch",
            error: error.message,
        });
    }
});

export const updateRoute = asyncHandler(async (req, res) => {
    try {
        const { routeId } = req.params;  // Get ID from URL
        const updates = req.body;     // Get new data from body
        const updateRoute = await Routes.findByIdAndUpdate(routeId, updates, { new: true }); // Return the updated document
        if (!updateRoute) {
            return res.status(404).json({ success: false, message: "Route not found" });
        }

        res.status(200).json({
            success: true,
            data: updateRoute
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update route",
            error: error.message,
        });
    }
});

export const deleteRoute = asyncHandler(async (req, res) => {
    try {
        const { routeId } = req.params;
        const route = await Routes.findByIdAndDelete(routeId);
        if (!route) {
            return res.status(404).json({
                success: false,
                message: "id does not exists"
            });
        } return res.status(200).json({
            success: true,
            message: "route deleted successful"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete route",
            error: error.message,
        });
    }
});