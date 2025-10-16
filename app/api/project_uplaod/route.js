import cloudinary from "@/app/lib/cloudinary";
import pool from "@/app/lib/db";
import { Readable } from "stream";

// Next.js API route for file upload
export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("image"); // file
    const category = formData.get("category");
    const title = formData.get("title");
    const technologies = formData.get("technologies");
    const liveUrl = formData.get("liveUrl");
    const githubUrl = formData.get("githubUrl");
    const description = formData.get("description");
    const order = formData.get("order");

    if (!file) {
      return new Response(JSON.stringify({ error: "Image is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary using stream
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "Uploaded_Images" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      Readable.from(buffer).pipe(stream);
    });

    const result = await uploadPromise;
    const imageUrl = result.secure_url;

    // Convert technologies string to JSON array
    const jsonTechnologies = technologies
      ? JSON.stringify(
          technologies
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      : "[]";

    // Insert into MySQL
    const [inserted] = await pool.execute(
      `INSERT INTO project_model 
      (title, description, category, technologies, github_url, live_url, image, order_position, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, description, category, jsonTechnologies, githubUrl, liveUrl, imageUrl, order]
    );

    return new Response(
      JSON.stringify({ message: "Uploaded successfully", project: inserted }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
