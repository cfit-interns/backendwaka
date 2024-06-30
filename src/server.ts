import app from "./app"; // Import the Express application instance
import env from "./util/validateEnv"; // Import environment variable validator
import mongoose from "mongoose"; // Import Mongoose for MongoDB interactions
const emailScheduler = require("./Schedule/emailScheduler"); // Import email scheduler module

const port = env.PORT || 3000; // Set the port from environment variables or default to 3000

// Initialize and start the email scheduler
emailScheduler.start();

// Connect to MongoDB using Mongoose
mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected"); // Log successful connection to MongoDB
        app.listen(port, () => {
            console.log("Server running on port: " + port); // Start the server and log the port it's running on
        });
    })
    .catch(console.error); // Log any errors that occur during the connection process
