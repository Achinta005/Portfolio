import { NextResponse } from "next/server";

export async function GET(req) {
  const cookies = req.headers.get("cookie") || "";
  const token = cookies
    .split(";")
    .find((c) => c.trim().startsWith("anilist_token="))
    ?.split("=")[1];

  return NextResponse.json({ authenticated: !!token });
}
