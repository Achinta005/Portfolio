// routes/trackVisit.js
const express = require("express");
const router = express.Router();

const redis = require("../config/redis");
const connectMongoDB = require("../config/mongodb");
const WeeklyVisit = require("../models/WeeklyVisit");
const getWeekKey = require("../utils/getWeekKey");
const IPModel = require("../models/ipaddressmodel");
const axios = require("axios");

const VISIT_TTL = 30 * 60;

router.post("/visit", async (req, res) => {
  try {
    // Get visitor IP address
    let ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["x-real-ip"] ||
      req.ip;

    // Handle localhost/internal IPs
    if (!ipAddress || ["::1", "127.0.0.1"].includes(ipAddress)) {
      try {
        const resp = await axios.get("https://api.ipify.org?format=json");
        ipAddress = resp.data.ip;
      } catch (err) {
        console.error("[VISIT] Failed to fetch external IP:", err.message);
        return res.status(204).end();
      }
    }

    // Check if this IP is in the excluded list
    await connectMongoDB();

    const excludedIP = await IPModel.findOne({ ipaddress: ipAddress });

    if (excludedIP) {
      console.log("[VISIT] IP excluded:", ipAddress);
      return res.status(204).end();
    }

    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).end();

    // Redis key per visitor session
    const redisKey = `visit:${sessionId}`;

    const alreadyVisited = await redis.exists(redisKey);

    // Ignore refresh / repeated calls
    if (alreadyVisited) {
      return res.status(204).end();
    }

    // New visit
    await redis.set(redisKey, 1, "EX", VISIT_TTL);

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
    console.error("[VISIT] Error:", err);
    res.status(500).end();
  }
});

// GET all weekly visits (sorted by week)
router.get("/visits", async (req, res) => {
  try {
    await connectMongoDB();

    const visits = await WeeklyVisit.find()
      .sort({ week: 1 }) // Sort ascending by week
      .lean(); // Convert to plain JavaScript objects for better performance

    res.status(200).json(visits);
  } catch (err) {
    console.error("Error fetching visits:", err);
    res.status(500).json({ error: "Failed to fetch visits data" });
  }
});

// GET visits with pagination
router.get("/visits/paginated", async (req, res) => {
  try {
    await connectMongoDB();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const visits = await WeeklyVisit.find()
      .sort({ week: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await WeeklyVisit.countDocuments();

    res.status(200).json({
      visits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching paginated visits:", err);
    res.status(500).json({ error: "Failed to fetch visits data" });
  }
});

// GET visits for a specific date range
router.get("/visits/range", async (req, res) => {
  try {
    await connectMongoDB();

    const { startWeek, endWeek } = req.query;

    if (!startWeek || !endWeek) {
      return res.status(400).json({
        error:
          "Both startWeek and endWeek parameters are required (format: YYYY-WXX)",
      });
    }

    const visits = await WeeklyVisit.find({
      week: {
        $gte: startWeek,
        $lte: endWeek,
      },
    })
      .sort({ week: 1 })
      .lean();

    res.status(200).json(visits);
  } catch (err) {
    console.error("Error fetching visits range:", err);
    res.status(500).json({ error: "Failed to fetch visits data" });
  }
});

// GET visits for the last N weeks
router.get("/visits/recent/:weeks", async (req, res) => {
  try {
    await connectMongoDB();

    const weeks = parseInt(req.params.weeks) || 4;

    const visits = await WeeklyVisit.find()
      .sort({ week: -1 })
      .limit(weeks)
      .lean();

    // Reverse to show oldest to newest
    visits.reverse();

    res.status(200).json(visits);
  } catch (err) {
    console.error("Error fetching recent visits:", err);
    res.status(500).json({ error: "Failed to fetch visits data" });
  }
});

// GET a specific week's data
router.get("/visits/:weekKey", async (req, res) => {
  try {
    await connectMongoDB();

    const { weekKey } = req.params;

    // Validate week format (YYYY-WXX)
    if (!/^\d{4}-W\d{1,2}$/.test(weekKey)) {
      return res.status(400).json({
        error: "Invalid week format. Use YYYY-WXX (e.g., 2025-W51)",
      });
    }

    const visit = await WeeklyVisit.findOne({ week: weekKey }).lean();

    if (!visit) {
      return res.status(404).json({
        error: "No data found for the specified week",
      });
    }

    res.status(200).json(visit);
  } catch (err) {
    console.error("Error fetching specific week:", err);
    res.status(500).json({ error: "Failed to fetch visit data" });
  }
});

// GET statistics/summary
router.get("/visits/stats/summary", async (req, res) => {
  try {
    await connectMongoDB();

    const visits = await WeeklyVisit.find().sort({ week: 1 }).lean();

    if (visits.length === 0) {
      return res.status(200).json({
        totalVisits: 0,
        totalWeeks: 0,
        averagePerWeek: 0,
        highestWeek: null,
        lowestWeek: null,
        trend: 0,
      });
    }

    const totalVisits = visits.reduce((sum, v) => sum + v.visits, 0);
    const averagePerWeek = Math.round(totalVisits / visits.length);

    // Find highest and lowest weeks
    const sortedByVisits = [...visits].sort((a, b) => b.visits - a.visits);
    const highestWeek = sortedByVisits[0];
    const lowestWeek = sortedByVisits[sortedByVisits.length - 1];

    // Calculate trend (last week vs previous week)
    let trend = 0;
    if (visits.length >= 2) {
      const lastWeek = visits[visits.length - 1].visits;
      const prevWeek = visits[visits.length - 2].visits;
      trend = prevWeek > 0 ? ((lastWeek - prevWeek) / prevWeek) * 100 : 0;
    }

    res.status(200).json({
      totalVisits,
      totalWeeks: visits.length,
      averagePerWeek,
      highestWeek: {
        week: highestWeek.week,
        visits: highestWeek.visits,
      },
      lowestWeek: {
        week: lowestWeek.week,
        visits: lowestWeek.visits,
      },
      trend: Math.round(trend * 10) / 10, // Round to 1 decimal
      firstWeek: visits[0].week,
      lastWeek: visits[visits.length - 1].week,
    });
  } catch (err) {
    console.error("Error fetching visit stats:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// GET current week's data
router.get("/visits/current/week", async (req, res) => {
  try {
    await connectMongoDB();

    // Use the same getWeekKey utility
    const getWeekKey = require("../utils/getWeekKey");
    const currentWeek = getWeekKey();

    const visit = await WeeklyVisit.findOne({ week: currentWeek }).lean();

    if (!visit) {
      return res.status(200).json({
        week: currentWeek,
        visits: 0,
        message: "No visits recorded for current week yet",
      });
    }

    res.status(200).json(visit);
  } catch (err) {
    console.error("Error fetching current week:", err);
    res.status(500).json({ error: "Failed to fetch current week data" });
  }
});

module.exports = router;
