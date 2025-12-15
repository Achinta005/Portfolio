// routes/trackVisit.js
const express = require("express");
const router = express.Router();

const redis = require("../config/redis");
const connectMongoDB = require("../config/mongodb");
const WeeklyVisit = require("../models/WeeklyVisit");
const getWeekKey = require("../utils/getWeekKey");

const VISIT_TTL = 30 * 60;

router.post("/visit", async (req, res) => {
  try {
    // Optional: exclude admin devices
    if (req.cookies?.exclude_analytics === "true") {
      return res.status(204).end();
    }

    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).end();

    // Redis key per visitor session
    const redisKey = `visit:${sessionId}`;

    const alreadyVisited = await redis.exists(redisKey);

    // 🚫 Ignore refresh / repeated calls
    if (alreadyVisited) {
      return res.status(204).end();
    }

    // ✅ New visit
    await redis.set(redisKey, 1, "EX", VISIT_TTL);

    await connectMongoDB();

    const weekKey = getWeekKey();

    await WeeklyVisit.findOneAndUpdate(
      { week: weekKey },
      {
        $inc: { visits: 1 },
        $set: { lastUpdated: new Date() },
      },
      { upsert: true }
    );

    res.status(204).end();
  } catch (err) {
    console.error("Visit tracking error:", err);
    res.status(500).end();
  }
});

module.exports = router;
