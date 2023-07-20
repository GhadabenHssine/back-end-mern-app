const mongoose = require("mongoose");

const UserShema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model("User", UserShema);