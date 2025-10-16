export const GET = async () => {
  try {
    return new Response(
      JSON.stringify({ status: 'ok', message: 'Next.js backend is running!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ status: 'error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
