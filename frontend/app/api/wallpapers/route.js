import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const WALLPAPERS_DIR = path.join(process.cwd(), "public", "wallpapers");
const SUPPORTED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".mp4",
  ".webm",
  ".mov",
];

export async function GET(request) {
  try {
    // Create wallpapers directory if it doesn't exist
    await fs.mkdir(WALLPAPERS_DIR, { recursive: true });

    // Read directory
    const files = await fs.readdir(WALLPAPERS_DIR);

    // Filter supported files
    const wallpapers = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return SUPPORTED_EXTENSIONS.includes(ext);
      })
      .map((file) => {
        const ext = path.extname(file).toLowerCase();
        const isVideo = [".mp4", ".webm", ".mov"].includes(ext);
        const name = path.parse(file).name.replace(/[-_]/g, " ");

        return {
          id: file,
          src: `/wallpapers/${file}`,
          type: isVideo ? "video" : "image",
          name: name.charAt(0).toUpperCase() + name.slice(1),
        };
      });

    return NextResponse.json({
      wallpapers,
      total: wallpapers.length,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        wallpapers: [],
        error: "Failed to fetch wallpapers",
        total: 0,
      },
      { status: 500 },
    );
  }
}
