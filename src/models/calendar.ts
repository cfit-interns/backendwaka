import { InferSchemaType, Schema, model } from "mongoose";

// Define the schema for calendar entries
const calendarSchema = new Schema({
    calendarId: { type: Schema.Types.ObjectId }, // Unique identifier for the calendar entry
    date: { type: String, required: true }, // Date of the event
    title: { type: String, required: true }, // Title of the event
    description: { type: String }, // Description of the event
    location: { type: String }, // Location of the event
    startTime: { type: String, required: true }, // Start time of the event
    endTime: { type: String, required: true }, // End time of the event
}, { timestamps: true }); // Add timestamps for created and updated times

// Infer the TypeScript type for the Calendar schema
type Calendar = InferSchemaType<typeof calendarSchema>;

// Create and export the Calendar model
export default model<Calendar>("Calendar", calendarSchema);
