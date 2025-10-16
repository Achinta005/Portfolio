import pool from "@/app/lib/db";

// GET method for fetching skills data
export async function GET(req) {
  try {
    const [categories] = await pool.execute("SELECT * FROM skills_categories");
    const [skills] = await pool.execute("SELECT * FROM individual_skills");

    const skillsData = categories.map((cat) => ({
      _id: cat.id.toString(),
      description: cat.description,
      experienceLevel: cat.experience_level,
      title: cat.title,
      skills: skills
        .filter((skill) => skill.skill_category_id === cat.id)
        .map((skill) => ({
          id: skill.skill_id,
          skill: skill.skill_name,
          category: skill.category,
          color: skill.color,
          proficiency: skill.proficiency,
          stage: skill.stage,
          description: skill.description,
          image: skill.image,
        })),
    }));

    return new Response(JSON.stringify(skillsData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch skills" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Optional: POST handler if you want to allow POST requests
export async function POST(req) {
  // handle POST requests here if needed
  return new Response(JSON.stringify({ message: "POST method not implemented" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}
