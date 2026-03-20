import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const folder = process.env.NEXT_PUBLIC_WALLPAPERS_FOLDER || "wallpapers";
    const cdnUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_CDN;

    if (!cloudName)
      throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is missing");
    if (!apiKey) throw new Error("CLOUDINARY_API_KEY is missing");
    if (!apiSecret) throw new Error("CLOUDINARY_API_SECRET is missing");

    console.log(`🔄 Searching Cloudinary folder: ${folder}`);

    const credentials = `${apiKey}:${apiSecret}`;
    const base64Credentials = Buffer.from(credentials).toString("base64");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64Credentials}`,
        },
        body: JSON.stringify({
          expression: `folder="${folder}" AND (resource_type:video OR resource_type:image)`,
          max_results: 500,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary API error:", data);
      throw new Error(
        `API error: ${data.error?.message || response.statusText}`,
      );
    }

    const wallpapers = (data.resources || []).map((resource) => {
      const isVideo = resource.resource_type === "video";

      let cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/${resource.resource_type}/upload/`;

      if (isVideo) {
        cloudinaryUrl += `q_90,f_auto,c_fill,w_1920,h_1080,g_auto/${resource.public_id}.${resource.format}`;
      } else {
        cloudinaryUrl += `q_90,f_auto,c_fill,w_1920,h_1080,g_auto/${resource.public_id}.${resource.format}`;
      }

      // Use Cloudflare CDN if configured
      const url = cdnUrl
        ? `${cdnUrl}/cloudinary/${cloudName}/${resource.resource_type}/${resource.public_id}`
        : cloudinaryUrl;

      return {
        id: resource.public_id,
        src: url,
        cloudinaryUrl,
        type: isVideo ? "video" : "image",
        name: resource.public_id
          .split("/")
          .pop()
          .replace(/[-_]/g, " ")
          .replace(/\.[^.]+$/, ""),
        publicId: resource.public_id,
      };
    });

    wallpapers.sort((a, b) => a.name.localeCompare(b.name));

    console.log(`✅ Loaded ${wallpapers.length} wallpapers from Cloudinary`);
    console.log(
      `${cdnUrl ? "🌐 Using Cloudflare CDN" : "📡 Using Cloudinary CDN directly"}`,
    );

    return NextResponse.json({
      success: true,
      wallpapers,
      total: wallpapers.length,
      cdn: cdnUrl ? "cloudflare" : "cloudinary",
    });
  } catch (error) {
    console.error("❌ API Error:", error.message);

    return NextResponse.json(
      {
        success: false,
        wallpapers: [],
        error: error.message,
      },
      { status: 500 },
    );
  }
}
