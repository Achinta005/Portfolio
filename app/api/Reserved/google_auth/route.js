

export async function GET() {
    const redirectUrl="https://accounts.google.com/o/oauth2/v2/auth?" +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.REDIRECT_URL}&` +
    `response_type=code&` +
    `scope=email profile&` +
    `access_type=offline`;
    return Response.redirect(redirectUrl)
}