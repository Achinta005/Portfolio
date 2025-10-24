import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(request) {
  // Get user_id from request body
  const { user_id } = await request.json();
  
  if (!user_id) {
    return NextResponse.json(
      { error: "user_id is required" },
      { status: 400 }
    );
  }

  let ipAddress = request.headers.get("x-forwarded-for");

  if (ipAddress) {
    ipAddress = ipAddress.split(",")[0].trim();
  }

  if (!ipAddress) {
    ipAddress = request.headers.get("x-real-ip");
  }

  // Check if it's localhost
  if (!ipAddress || ipAddress === "::1" || ipAddress === "127.0.0.1") {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      ipAddress = data.ip;
    } catch (error) {
      return NextResponse.json({
        error: "Unable to detect IP",
        source: "localhost",
      });
    }
  }

  // Check if IP already exists
  const checkIP = async (ip) => {
    const query = "SELECT user_id FROM ipaddress WHERE ipaddress = ? LIMIT 1";

    try {
      const [rows] = await pool.query(query, [ip]);

      if (rows.length > 0) {
        return rows[0].user_id;
      }

      return null;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  };

  try {
    // AWAIT the checkIP function
    const existingUserId = await checkIP(ipAddress);

    if (existingUserId) {
      // IP already exists
      return NextResponse.json({
        ip: ipAddress,
        user_id: existingUserId,
        status: "existing",
        source: "database",
      });
    }

    // IP doesn't exist, insert it
    await pool.execute(
      "INSERT INTO ipaddress (user_id, ipaddress) VALUES (?, ?)",
      [user_id, ipAddress]
    );

    return NextResponse.json({
      ip: ipAddress,
      user_id: user_id,
      status: "inserted",
      source: "headers",
    });
  } catch (error) {
    console.error("Database operation failed:", error);
    return NextResponse.json(
      { error: "Database operation failed" },
      { status: 500 }
    );
  }
}
