const mongoose = require("mongoose");

const WeeklyVisitSchema = new mongoose.Schema({
  week: {
    type: String, // e.g. 2025-W3
    unique: true,
    required: true,
  },
  visits: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("WeeklyVisit", WeeklyVisitSchema);
