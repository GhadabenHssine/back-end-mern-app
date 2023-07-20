const mongoose = require("mongoose");

const ListShema = mongoose.Schema({
    title: { type: String, required: true, unique: true },
    type: { type: String },
    content: { type: Array, required: true },
    genre: { type: String },


}, { timestamps: true });

module.exports = mongoose.model("List", ListShema);