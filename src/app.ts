import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import staffRoutes from "./routes/staffs";
import userRoutes from ".//routes/users";
import registerRoutes from "./routes/registers";
import bookingRoutes from "./routes/bookings";
import rosterRoutes from "./routes/rosters";
import calendarRoutes from "./routes/calendars";
import morgan from "morgan";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import session from "express-session";
import { getAuthenticatedStaff } from "./middleware/auth";
import createHttpError, { isHttpError } from "http-errors";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express(); // Create an instance of the Express application

app.use(morgan("dev")); // Use morgan middleware for logging HTTP requests

app.use(express.json()); // Middleware to parse JSON bodies

app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies

app.use(
    cors({
        credentials: true,
        // origin: "http://localhost:3000",
        origin: "*", // Allow all origins
    })
);

app.use(cookieParser()); // Middleware to parse cookies

app.use(session({
    secret: env.SESSION_SECRET, // Secret key for signing session ID cookies
    resave: false, // Prevent session from being saved back to the store if it wasn't modified
    saveUninitialized: false, // Prevent uninitialized session from being saved to the store
    cookie: {
        maxAge: 60 * 60 * 1000, // Session cookie max age in milliseconds (1 hour)
    },
    rolling: true, // Reset cookie Max-Age on every response
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING // MongoDB connection string for session store
    }),
}));

app.use("/api/users", userRoutes); // Use user routes for /api/users

app.use("/api/staffs", staffRoutes); // Use staff routes for /api/staffs

app.use("/api/registers", registerRoutes); // Use register routes for /api/registers

app.use("/api/rosters", getAuthenticatedStaff, rosterRoutes); // Use roster routes for /api/rosters with authentication middleware

app.use("/api/bookings", bookingRoutes); // Use booking routes for /api/bookings

app.use("/api/calendars", calendarRoutes); // Use calendar routes for /api/calendars

// Middleware to handle 404 errors (Endpoint not found)
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
})

// Error-handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app; // Export the Express application instance
