import fs from 'fs';
import path from 'path';

export const GET = async (req) => {
  try {
    const filePath = path.join(process.cwd(), 'files', 'resume.pdf'); // Adjust if your file is elsewhere
    const fileBuffer = fs.readFileSync(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Achinta_Resume.pdf"',
      },
    });
  } catch (err) {
    console.error('File download error:', err);
    return new Response('Download failed', { status: 500 });
  }
};
