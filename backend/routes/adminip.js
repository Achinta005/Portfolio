const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

const getMySQLConnection = require("../config/mysqldb");
const connectMongoDB = require("../config/mongodb");
const AdminIPModel = require("../models/adminIp");

// IP validation regex
const IP_PATTERN =
  /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const validateIP = (ip) => IP_PATTERN.test(ip);

// -------- Get all IPs --------
router.get("/ips", async (req, res) => {
  try {
    await connectMongoDB();

    const mysqlPromise = (async () => {
      const mysqlConn = await getMySQLConnection();
      try {
        const [rows] = await mysqlConn.execute(
          "SELECT id AS ip_id, ipaddress AS ip, created_at FROM admin_ipaddress ORDER BY created_at DESC"
        );
        return { source: "mysql", data: rows };
      } finally {
        await mysqlConn.end();
      }
    })();

    const mongoPromise = (async () => {
      const result = await AdminIPModel.find({})
        .select({ _id: 0, ip: 1, created_at: 1, ip_id: 1 })
        .sort({ created_at: -1 });

      const formatted = result.map((ip) => ({
        ip_id: ip.ip_id,
        ip: ip.ip,
        created_at: ip.created_at,
      }));

      return { source: "mongodb", data: formatted };
    })();

    const results = await Promise.allSettled([mysqlPromise, mongoPromise]);

    const mysqlData =
      results[0].status === "fulfilled" ? results[0].value.data : [];
    const mongoData =
      results[1].status === "fulfilled" ? results[1].value.data : [];

    const mergedMap = new Map();
    [...mysqlData, ...mongoData].forEach((ip) => {
      mergedMap.set(ip.ip, ip);
    });

    const mergedIPList = [...mergedMap.values()].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return res.status(200).json({
      success: true,
      count: mergedIPList.length,
      data: mergedIPList,
      sync: {
        mysql: results[0].status,
        mongodb: results[1].status,
      },
    });
  } catch (err) {
    console.error("Fetch admin IP error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch admin IP addresses",
      message: err.message,
    });
  }
});

// -------- Add new IP --------
router.post("/ips", async (req, res) => {
  const { ip } = req.body || {};

  if (!ip) {
    return res
      .status(400)
      .json({ success: false, error: "IP address is required" });
  }

  if (!validateIP(ip)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid IP address format" });
  }

  await connectMongoDB();

  let mysqlConn;
  let newIpId;

  try {
    // First: Write to MySQL
    mysqlConn = await getMySQLConnection();

    const [existing] = await mysqlConn.execute(
      "SELECT id FROM admin_ipaddress WHERE ipaddress = ?",
      [ip]
    );
    if (existing.length) {
      return res.status(409).json({
        success: false,
        error: "IP address already exists in MySQL / Mongo",
      });
    }

    const [result] = await mysqlConn.execute(
      "INSERT INTO admin_ipaddress (ipaddress) VALUES (?)",
      [ip]
    );

    newIpId = result.insertId;

    // Second: Write to Mongo with SAME id
    await AdminIPModel.updateOne(
      { ip },
      {
        $set: {
          ip_id: newIpId,
          ip,
          created_at: new Date(),
        },
      },
      { upsert: true } // ensures record exists
    );

    return res.status(201).json({
      success: true,
      message: "IP address added successfully",
      ip: {
        ip_id: newIpId,
        ip,
        created_at: new Date().toISOString(),
      },
      stored_in: ["mysql", "mongodb"],
    });
  } catch (err) {
    console.error("Add IP failed:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  } finally {
    if (mysqlConn) await mysqlConn.end();
  }
});

// -------- Delete IP --------
router.delete("/ips/:ip_id", async (req, res) => {
  const ipId = parseInt(req.params.ip_id, 10);
  if (isNaN(ipId)) {
    return res.status(400).json({ success: false, error: "Invalid IP id" });
  }

  await connectMongoDB();
  let mysqlConn;

  try {
    mysqlConn = await getMySQLConnection();

    // Fetch IP details first
    const [rows] = await mysqlConn.execute(
      "SELECT id, ipaddress AS ip FROM admin_ipaddress WHERE id = ?",
      [ipId]
    );

    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, error: "IP address not found" });
    }

    const deletedIp = rows[0];

    // MySQL delete first
    const mysqlDelete = mysqlConn.execute(
      "DELETE FROM admin_ipaddress WHERE id = ?",
      [ipId]
    );

    // Mongo delete using ip_id or ip fallback
    const mongoDelete = AdminIPModel.deleteOne({
      $or: [{ ip_id: ipId }, { ip: deletedIp.ip }],
    });

    const results = await Promise.allSettled([mysqlDelete, mongoDelete]);

    return res.status(200).json({
      success: true,
      message: "IP address deleted",
      deleted_ip: deletedIp,
      sync: {
        mysql: results[0].status,
        mongodb: results[1].status,
      },
      fallback: results[1].status === "rejected",
    });
  } catch (err) {
    console.error("Delete IP failed:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  } finally {
    if (mysqlConn) await mysqlConn.end();
  }
});

module.exports = router;
