import { InferSchemaType, model, Schema } from "mongoose";

// Define the schema for the staff document
const staffSchema = new Schema({
    email: { type: String, required: true, unique: true, select: false }, // Staff email, required and unique, not selected by default
    password: { type: String, required: true, unique: true, select: false }, // Staff password, required and unique, not selected by default
    role: { type: String, required: true, select: false }, // Staff role, required, not selected by default
});

// Infer the TypeScript type based on the schema
type Staff = InferSchemaType<typeof staffSchema>;

// Create and export the Staff model based on the schema
export default model<Staff>("Staff", staffSchema);
