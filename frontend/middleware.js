import { NextResponse } from 'next/server';

export function middleware(request) {
  // For now, let's disable middleware and handle auth in components
  // The localStorage token can't be accessed in middleware
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};