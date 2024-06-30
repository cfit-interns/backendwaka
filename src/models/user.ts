import { InferSchemaType, model, Schema } from "mongoose";

// Define the schema for the user document
const userSchema = new Schema({
    username: { type: String, required: true, unique: true }, // User's username, required and unique
    password: { type: String, required: true, select: false }, // User's password, required but not selected by default
    firstName: { type: String, required: true }, // User's first name, required
    lastName: { type: String, required: true }, // User's last name, required
    dob: { type: String, required: true, select: false }, // User's date of birth, required but not selected by default
    email: { type: String, required: true, unique: true, select: false }, // User's email, required and unique, not selected by default
    address: { type: String, required: true, select: false }, // User's address, required but not selected by default
    town: { type: String, required: true }, // User's town, required
    postcode: { type: String, required: true }, // User's postcode, required
    phoneNumber: { type: String, required: true, select: false }, // User's phone number, required but not selected by default
    altPhoneNumber: { type: String, select: false }, // User's alternate phone number, not selected by default
    gender: { type: String, required: true, select: false }, // User's gender, required but not selected by default
    ethnicity: { type: String, required: true, select: false }, // User's ethnicity, required but not selected by default
    disability: { type: String, required: true, select: false }, // User's disability, required but not selected by default
    disabilityDetails: { type: String, select: false }, // Details of user's disability, not selected by default
    assistance: { type: String, select: false }, // User's assistance information, not selected by default
    emergencyName: { type: String, required: true, select: false }, // Name of user's emergency contact, required but not selected by default
    emergencyPhone: { type: String, required: true, select: false }, // Phone number of user's emergency contact, required but not selected by default
    emergencyRelationship: { type: String, required: true, select: false }, // Relationship of user to emergency contact, required but not selected by default
    role: { type: String, required: true }, // Role of the user, required
});

// Infer the TypeScript type based on the schema
type User = InferSchemaType<typeof userSchema>;

// Create and export the User model based on the schema
export default model<User>("User", userSchema);
