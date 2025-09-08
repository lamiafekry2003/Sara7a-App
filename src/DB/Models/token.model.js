
import mongoose, { Schema } from "mongoose";

const tokenSchema = new Schema(
  {
    jti: {
      type: String,
      required: true,
      unique: true,
    },
    expiresId: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
export const tokenModel =
  mongoose.model.Token || mongoose.model("Token", tokenSchema);
