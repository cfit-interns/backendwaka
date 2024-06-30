import { InferSchemaType, Schema, model } from "mongoose";

const ResetPasswordSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true }, // Reference to the user who requested the password reset
    resetPassword: { type: String, required: true, select: false }, // The reset password token, not selected by default
});

// Infer the TypeScript type for the ResetPassword schema
type ResetPassword = InferSchemaType<typeof ResetPasswordSchema>;

// Create and export the ResetPassword model
export default model<ResetPassword>("ResetPassword", ResetPasswordSchema);
