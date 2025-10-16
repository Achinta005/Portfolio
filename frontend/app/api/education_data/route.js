import pool from '../../lib/db';

export const GET = async (req) => {
  try {
    const [result] = await pool.execute('SELECT * FROM education');
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching education data:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch education data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
