import mongoose from "mongoose";

import { setJson, encryptPassword, createFileURL } from "../helpers/Model.js";

const schema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: {
      type: String,
      required: false,
      set: encryptPassword,
    },
    profileImage: {
      type: String,
      required: false,
      get: (value) => createFileURL(value, "users"),
    },
  },
  {
    toJSON: setJson,
    timestamps: true,
    versionKey: false,
    virtuals: { token: { type: String } },
  }
);

const User = mongoose.model("User", schema);

export default User;
