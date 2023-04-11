import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
  {
    user: { type: String, trim: true },
    password: { type: String},
    googleUser: {type: String},
    img: {type: String}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const hashedPassword = async (password: string) => {
  return await bcryptjs.hash(password, 10);
};

export const matchPassword = async (
  password: string,
  passwordHashed: string
) => {
  return await bcryptjs.compare(password, passwordHashed);
};

export default model("user", userSchema);
