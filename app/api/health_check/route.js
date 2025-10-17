export const GET = async () => {
  try {
    console.log("Client Is Connected ....")
    return new Response(
      JSON.stringify({ status: 'ok', message: '✅Coonection Successfull With Server...' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ status: 'error', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
