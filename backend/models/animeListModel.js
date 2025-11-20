const mongoose = require("mongoose");

const AnimeListSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },
    media_id: {
      type: Number,
      required: true,
      index: true,
    },
    list_name: { type: String },
    status: { type: String },
    score: { type: Number },
    progress: { type: Number },
    repeat_count: { type: Number },
    started_at: { type: Date },
    completed_at: { type: Date },
    updated_at: { type: Date },
    created_at: { type: Date },
    synced_at: { type: Date },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

AnimeListSchema.index({ username: 1, media_id: 1 }, { unique: false });

module.exports = mongoose.model("AnimeListModel", AnimeListSchema,"anime_list");
