import { InferSchemaType, Schema, model } from "mongoose";

// Define the schema for the roster document
const rosterSchema = new Schema({
    rosterId: { type: Schema.Types.ObjectId }, // Unique identifier for each roster entry
    date: { type: String, required: true }, // Date of the roster entry, required field
    driverName: { type: String, required: true }, // Name of the driver assigned to the roster
    vehiclePlate: { type: String, required: true }, // License plate of the vehicle used
    startTime: { type: String, required: true }, // Start time of the roster shift
    finishTime: { type: String, required: true }, // End time of the roster shift
    availabilityTime: { type: [String], required: true }, // Array of available times during the shift
    availabilityStatus: { type: [String], required: true }, // Array of availability statuses during the shift
}, { timestamps: true }); // Automatic timestamps for createdAt and updatedAt fields

// Infer the TypeScript type based on the schema
type Roster = InferSchemaType<typeof rosterSchema>;

// Create and export the Roster model based on the schema
export default model<Roster>("Roster", rosterSchema);
