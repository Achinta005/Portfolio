const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

const getConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
      rejectUnauthorized: true,
    },
  });
};

// IP validation regex
const IP_PATTERN = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const validateIP = (ip) => IP_PATTERN.test(ip);

// -------- Get all IPs --------
router.get("/ips", async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const [ips] = await conn.execute("SELECT id, ipaddress, created_at FROM admin_ipaddress ORDER BY created_at DESC");
    res.json({ success: true, ips, count: ips.length });
  } catch (err) {
    res.status(500).json({ success: false, error: `Database error: ${err.message}` });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- Add new IP --------
router.post("/ips", async (req, res) => {
  const { ipaddress } = req.body || {};

  if (!ipaddress) return res.status(400).json({ success: false, error: "IP address is required" });
  if (!validateIP(ipaddress)) return res.status(400).json({ success: false, error: "Invalid IP address format" });

  let conn;
  try {
    conn = await getConnection();

    const [existing] = await conn.execute("SELECT id FROM admin_ipaddress WHERE ipaddress = ?", [ipaddress]);
    if (existing.length) return res.status(409).json({ success: false, error: "IP address already exists" });

    const [result] = await conn.execute("INSERT INTO admin_ipaddress (ipaddress) VALUES (?)", [ipaddress]);
    const [newIpRows] = await conn.execute("SELECT id, ipaddress, created_at FROM admin_ipaddress WHERE id = ?", [result.insertId]);

    res.status(201).json({ success: true, message: "IP address added successfully", ip: newIpRows[0] });
  } catch (err) {
    if (conn) await conn.rollback();
    res.status(500).json({ success: false, error: `Database error: ${err.message}` });
  } finally {
    if (conn) await conn.end();
  }
});

// -------- Delete IP --------
router.delete("/ips/:ip_id", async (req, res) => {
  const ipId = parseInt(req.params.ip_id, 10);
  if (isNaN(ipId)) return res.status(400).json({ success: false, error: "Invalid IP id" });

  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute("SELECT id, ipaddress FROM admin_ipaddress WHERE id = ?", [ipId]);
    if (!rows.length) return res.status(404).json({ success: false, error: "IP address not found" });

    await conn.execute("DELETE FROM admin_ipaddress WHERE id = ?", [ipId]);
    res.json({ success: true, message: "IP address deleted successfully", deleted_ip: rows[0] });
  } catch (err) {
    if (conn) await conn.rollback();
    res.status(500).json({ success: false, error: `Database error: ${err.message}` });
  } finally {
    if (conn) await conn.end();
  }
});

module.exports = router;
