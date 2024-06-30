import { InferSchemaType, model, Schema } from "mongoose";

// Define the schema for booking
const bookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true }, // Reference to the user who made the booking
    firstName: { type: String, required: true }, // First name of the passenger
    lastName: { type: String, required: true }, // Last name of the passenger
    phoneNumber: { type: String, required: true }, // Contact phone number of the passenger
    email: { type: String, required: true }, // Email address of the passenger
    pickup: { type: String, required: true }, // Pickup location
    destination: { type: String, required: true }, // Destination location
    wheelchair: { type: String, required: true }, // Wheelchair requirement status
    passenger: { type: Number, required: true }, // Number of passengers
    purpose: { type: String, required: true }, // Purpose of the trip
    trip: { type: String, required: true }, // Number of trips
    date: { type: String, required: true }, // Booking date
    pickupTime: { type: String, required: true }, // Pickup time
    dropoffTime: { type: String, required: true }, // Drop-off time
    additionalNotes: { type: String }, // Additional notes
}, { timestamps: true }); // Add timestamps for created and updated times

// Infer the TypeScript type for the Booking schema
type Booking = InferSchemaType<typeof bookingSchema>;

// Create and export the Booking model
export default model<Booking>("Booking", bookingSchema);
