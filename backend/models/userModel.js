import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true},
  role: {
    type: String,
    enum: ["manager", "player", "backend dev", "frontend dev", "editor", "organizer", "customer", "subscriber"],
    required: true,
  },
  profileImage: { type: String },
}, { timestamps: true , versionKey: false});

const User = mongoose.model("User", userSchema);
export default User;