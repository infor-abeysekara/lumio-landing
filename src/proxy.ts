import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lumio_super_secret_key_2026_xyz'
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/activate') || pathname === '/login') {
    const token = request.cookies.get('lumio_session')?.value;
    
    if (!token) {
      if (pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return NextResponse.next();
    }

    try {
      // Verify token
      const verified = await jwtVerify(token, JWT_SECRET);
      const role = verified.payload.role as string;
      
      // If logged in and trying to access login page, redirect appropriately
      if (pathname === '/login') {
        if (role === 'CLIENT') return NextResponse.redirect(new URL('/dashboard', request.url));
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      // Role-based route protection
      if (pathname.startsWith('/admin') && role === 'CLIENT') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if ((pathname.startsWith('/dashboard') || pathname.startsWith('/activate')) && role !== 'CLIENT') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      
      const response = NextResponse.next();
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    } catch (error) {
      // Invalid token
      if (pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/activate/:path*', '/login'],
};
