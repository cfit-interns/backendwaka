import { InferSchemaType, model, Schema } from "mongoose";

const registerSchema = new Schema({
    username: { type: String, required: true, unique: true }, // User's unique username
    password: { type: String, required: true }, // User's password
    firstName: { type: String, required: true }, // User's first name
    lastName: { type: String, required: true }, // User's last name
    dob: { type: String, required: true }, // User's date of birth
    email: { type: String, required: true, unique: true }, // User's unique email address
    address: { type: String, required: true }, // User's address
    town: { type: String, required: true }, // User's town
    postcode: { type: String, required: true }, // User's postcode
    phoneNumber: { type: String, required: true }, // User's phone number
    altPhoneNumber: { type: String }, // User's alternative phone number
    gender: { type: String, required: true }, // User's gender
    ethnicity: { type: String, required: true }, // User's ethnicity
    disability: { type: String, required: true }, // User's disability status
    disabilityDetails: { type: String }, // Details of the user's disability
    assistance: { type: String, required: true }, // Assistance required by the user
    emergencyName: { type: String, required: true }, // Emergency contact name
    emergencyPhone: { type: String, required: true }, // Emergency contact phone number
    emergencyRelationship: { type: String, required: true }, // Relationship with the emergency contact
}, { timestamps: true }); // Add timestamps for created and updated times

// Infer the TypeScript type for the Register schema
type Register = InferSchemaType<typeof registerSchema>;

// Create and export the Register model
export default model<Register>("Register", registerSchema);
