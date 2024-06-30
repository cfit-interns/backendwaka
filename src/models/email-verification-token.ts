import { InferSchemaType, model, Schema } from "mongoose";

// Define the schema for email verification tokens
const emailVerificationTokenSchema = new Schema({
    email: { type: String, required: true }, // Email address to be verified
    verificationCode: { type: String, required: true }, // Verification code sent to the email
    createdAt: { type: Date, default: Date.now, expires: "10m" }, // Creation time of the token, expires in 10 minutes
});

// Infer the TypeScript type for the email verification token schema
export type EmailVerificationToken = InferSchemaType<typeof emailVerificationTokenSchema>;

// Create and export the EmailVerificationToken model
export default model<EmailVerificationToken>("EmailVerificationToken", emailVerificationTokenSchema);
