import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/','/login(.*)', '/register(.*)','/api/users','/api/messages','/api/login']);


export default clerkMiddleware((auth, request) => {


  if(!isPublicRoute(request)) {
    auth().protect();
  }

  if(auth().userId && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if(auth().userId && request.nextUrl.pathname === '/register') {
    return NextResponse.redirect(new URL("/", request.url));
  }

});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};