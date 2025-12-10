const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
const { getCache, setCache, clearCache } = require("../utils/cache");

const getMySQLConnection = require("../config/mysqldb");
const connectMongoDB = require("../config/mongodb");
const ProjectModelMongo = require("../models/projectmodel");

const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =======================================================================
// 📌 GET PROJECTS → FASTEST DB + FALLBACK (CLEAN LOGGING)
// =======================================================================
router.get("/projects_data", async (req, res) => {
  console.log("\n[GET] /projects_data");

  const CACHE_KEY = "projects_data";

  // 1️⃣ RETURN FROM CACHE IF AVAILABLE
  const cached = getCache(CACHE_KEY);
  if (cached) {
    console.log("✔ Returning Projects from CACHE");
    return res.status(200).json({
      from: "cache",
      data: cached,
    });
  }

  try {
    await connectMongoDB();
    console.log("MongoDB connected");

    // ---------- MYSQL PROMISE ----------
    const mysqlPromise = new Promise(async (resolve, reject) => {
      try {
        const conn = await getMySQLConnection();

        const [rows] = await conn.execute(
          "SELECT * FROM project_model ORDER BY order_position DESC"
        );

        console.log("MySQL projects:", rows.length);

        resolve({ source: "mysql", data: rows });
      } catch (err) {
        reject({ source: "mysql", error: err });
      }
    });

    // ---------- MONGO PROMISE ----------
    const mongoPromise = new Promise(async (resolve, reject) => {
      try {
        const docs = await ProjectModelMongo.find().sort({ order: -1 });

        console.log("Mongo projects:", docs.length);

        resolve({ source: "mongodb", data: docs });
      } catch (err) {
        reject({ source: "mongodb", error: err });
      }
    });

    // ---------- RACE ----------
    let fastest;
    try {
      fastest = await Promise.race([mysqlPromise, mongoPromise]);
      console.log("✔ Fastest DB:", fastest.source);
    } catch (err) {
      console.log("⚠ Fastest DB failed:", err.source);

      const fallback =
        err.source === "mysql" ? await mongoPromise : await mysqlPromise;

      console.log("✔ Fallback DB:", fallback.source);
      fastest = fallback;
    }

    // 2️⃣ IF FASTEST RETURNS EMPTY → TRY OTHER DB
    if (!Array.isArray(fastest.data) || fastest.data.length === 0) {
      console.log("⚠ Fastest DB returned EMPTY → trying fallback");

      const fallback =
        fastest.source === "mysql" ? await mongoPromise : await mysqlPromise;

      console.log("✔ Fallback DB:", fallback.source);

      fastest = fallback;
    }

    // 3️⃣ CACHE ONLY IF DATA EXISTS
    if (Array.isArray(fastest.data) && fastest.data.length > 0) {
      setCache(CACHE_KEY, fastest.data);
      console.log("✔ Projects data CACHED");
    } else {
      console.log("⚠ Not caching EMPTY result");
    }

    // 4️⃣ SEND RESPONSE
    return res.status(200).json({
      from: fastest.source,
      data: fastest.data,
    });
  } catch (err) {
    console.log("❌ GET Error:", err.message);
    return res.status(500).json({
      error: "Failed to fetch projects",
      message: err.message,
    });
  }
});

// =======================================================================
// 📌 POST PROJECT UPLOAD → STORE IN MYSQL + MONGO (CLEAN LOGGING)
// =======================================================================
router.post("/project_upload", upload.single("image"), async (req, res) => {
  console.log("\n[POST] /project_upload");
  let conn;

  try {
    await connectMongoDB();
    console.log("MongoDB connected");

    const {
      title,
      description,
      category,
      technologies,
      githubUrl,
      liveUrl,
      order,
    } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Image is required" });
    }

    cloudinary.uploader
      .upload_stream(
        { folder: "Uploaded_Images", resource_type: "image" },
        async (error, result) => {
          if (error) return res.status(500).json({ error: error.message });

          const image_url = result.secure_url;
          const techList = technologies
            ? technologies.split(",").map((t) => t.trim())
            : [];

          // --------- MySQL Insert ----------
          const mysqlData = [
            title,
            description,
            category,
            JSON.stringify(techList),
            githubUrl,
            liveUrl,
            image_url,
            order,
          ];

          const mysqlInsert = new Promise(async (resolve, reject) => {
            try {
              conn = await getMySQLConnection();
              const [insertResult] = await conn.execute(
                `INSERT INTO project_model 
                 (title, description, category, technologies, github_url, live_url, image, order_position, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                mysqlData
              );
              console.log("✔ MySQL insert:", insertResult.insertId);
              resolve(insertResult.insertId);
            } catch (err) {
              console.log("❌ MySQL insert error:", err.message);
              reject(err);
            }
          });

          // --------- MongoDB Insert ----------
          const mongoInsert = ProjectModelMongo.create({
            title,
            description,
            category,
            technologies: techList,
            githubUrl,
            liveUrl,
            image: image_url,
            order,
          })
            .then((doc) => {
              console.log("✔ Mongo insert:", doc._id);
              return doc;
            })
            .catch((err) => {
              console.log("❌ Mongo insert error:", err.message);
              throw err;
            });

          const results = await Promise.allSettled([mysqlInsert, mongoInsert]);

          // CLEAR CACHE because new project added
          clearCache();
          console.log("✔ Cache Cleared After Upload");

          res.status(200).json({
            message: "Project stored in both databases",
            mysql: results[0],
            mongo: results[1],
          });
        }
      )
      .end(file.buffer);
  } catch (err) {
    console.log("❌ POST Error:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

module.exports = router;
