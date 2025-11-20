const mongoose = require("mongoose");

const AnimeDetailsSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    title_romaji: { type: String },
    title_english: { type: String },
    title_native: { type: String },
    cover_image_large: { type: String },
    cover_image_medium: { type: String },
    episodes: { type: Number },
    format: { type: String },
    status: { type: String },
    season: { type: String },
    season_year: { type: Number },
    genres: [{ type: String }], // JSON array in MySQL
    average_score: { type: Number },
    description: { type: String },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

module.exports = mongoose.model("AnimeDetailsModel", AnimeDetailsSchema,"anime_details");
