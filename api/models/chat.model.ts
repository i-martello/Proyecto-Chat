import { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    user: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

export default model('chat', chatSchema);
