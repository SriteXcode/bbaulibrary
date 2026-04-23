const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  libraryCardNo: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  profilePhoto: { type: String },
  dues: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
