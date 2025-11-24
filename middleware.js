import { clerkMiddleware } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If user is logged in, check their email domain
  if (userId) {
    try {
      // Get user details from Clerk
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const email = user.emailAddresses?.[0]?.emailAddress;
      
      
      
      // Block anyone without @sahyadri.edu.in email
      if (!email || !email.toLowerCase().endsWith('@sahyadri.edu.in')) {
        // Allow only the unauthorized page
        if (!req.nextUrl.pathname.startsWith('/unauthorized')) {
          console.log('Redirecting to unauthorized page');
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};