import About from "./About";

export const revalidate = 86400; // ISR – revalidate every 24 hours

//SSG Rendering
export default async function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL

  const [skillsRes, educationRes,certificateRes] = await Promise.all([
    fetch(`${baseUrl}/api/skill_data`, {
      next: { revalidate: 86400 },
    }),
    fetch(`${baseUrl}/api/education_data`, {
      next: { revalidate: 86400 },
    }),
    fetch(`${baseUrl}/api/certificates_date`, {
      next: { revalidate: 86400 },
    }),
  ]);

  // Error handling for both requests
  if (!skillsRes.ok) throw new Error("Failed to fetch skill data");
  if (!educationRes.ok) throw new Error("Failed to fetch education data");
  if (!certificateRes.ok) throw new Error("Failed to fetch Certificates data");

  // Parse JSON data
  const [skillsData, educationData,certificateData] = await Promise.all([
    skillsRes.json(),
    educationRes.json(),
    certificateRes.json()
  ]);

  // Pass both datasets to client component
  return <About skillsData={skillsData} educationData={educationData} certificateData={certificateData}/>;
}
