// Import the mongoose module to work with MongoDB.
import mongoose from "mongoose";

// Extend the express-session module to include custom properties in the session data.
declare module "express-session" {
    interface SessionData {
        // Add a property for storing the staff ID, which is of type mongoose.Types.ObjectId.
        staffId: mongoose.Types.ObjectId;
        
        // Add a property for storing the user ID, which is of type mongoose.Types.ObjectId.
        userId: mongoose.Types.ObjectId;
    }
}
