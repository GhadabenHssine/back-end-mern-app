const mongoose = require("mongoose");

const MovieShema = mongoose.Schema({
    title: { type: String, require: true, unique: true },
    desc: { type: String },
    img: { type: String },
    imgTitle: { type: String },
    imgSm: { type: String },
    trailer: { type: String },
    video: { type: String },
    limit: { type: Number },
    year: { type: String },
    genre: { type: String },
    isSeries: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model("Movie", MovieShema);