// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/api/webhooks(.*)',
  '/client/login',
  '/client/setup-password',
  '/client/forgot-password',
  '/client/reset-password',
  '/api/client/login',
  '/api/client/setup-password',
  '/api/client/validate-token',
  '/api/client/forgot-password',
])

// Define client routes
const isClientRoute = (pathname: string) => {
  return pathname.startsWith('/client/portal') || 
         (pathname.startsWith('/api/client/') && 
         !pathname.includes('/login') && 
         !pathname.includes('/setup-password') &&
         !pathname.includes('/validate-token') &&
         !pathname.includes('/forgot-password'))
}

// Define builder routes
const isBuilderRoute = (pathname: string) => {
  return pathname.startsWith('/projects') || 
         pathname.startsWith('/company') ||
         (pathname.startsWith('/api/') && !pathname.startsWith('/api/client/'))
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth()
  const pathname = req.nextUrl.pathname

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Handle client routes
  if (isClientRoute(pathname)) {
    // Client routes should not be accessible to builders
    if (userId) {
      return NextResponse.redirect(new URL('/projects', req.url))
    }
    
    // Check for client authentication
    const clientToken = req.cookies.get('client-token')?.value
    if (!clientToken) {
      return NextResponse.redirect(new URL('/client/login', req.url))
    }
    
    // Validate client token (basic check - full validation happens in the route)
    return NextResponse.next()
  }

  // Handle builder routes
  if (isBuilderRoute(pathname)) {
    // Redirect to login if not authenticated
    if (!userId) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    // Allow access to builder routes
    return NextResponse.next()
  }

  // Protect all other routes
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};