import { RequestHandler } from "express";
import createHttpError from "http-errors";
import StaffModel from "../models/staff";

// Handler to get the authenticated staff details
export const getAuthenticatedStaff: RequestHandler = async (req, res, next) => {
    const role = "staff"; // Define the role to be "staff"

    const staff = await StaffModel.findById(req.session.staffId).select("+role").exec();
    
    if (!staff) {
        // If no staff is found, return a 401 error
        next(createHttpError(401, "Staff not authenticated"));
    } else if (staff.role == role) {
        // If staff role matches, proceed to the next middleware/handler
        next();
    } else {
        // If staff role does not match, return a 401 error
        next(createHttpError(401, "Staff not authenticated"));
    }
};

// Middleware to authenticate the user
export const userAuth: RequestHandler = (req, res, next) => {
    if (req.session.userId) {
        // If user is authenticated, proceed to the next middleware/handler
        next();
    } else {
        // If user is not authenticated, return a 401 error
        next(createHttpError(401, "User not authenticated"));
    }
};
