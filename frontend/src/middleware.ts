import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface JWTPayload {
  id: number
  email: string
  nama: string
  role: string
}

const roleRoutes = {
  ADMIN: ['/admin'],
  MEKANIK: ['/mechanic'],
  GUDANG: ['/gudang'],
  PIMPINAN: ['/pimpinan'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Routes that don't require authentication
  const publicRoutes = ['/login', '/api/auth/login']
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // API routes that require authentication
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: false, message: 'Token tidak ditemukan.' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', decoded.id.toString())
      requestHeaders.set('x-user-role', decoded.role)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      return NextResponse.json(
        { status: false, message: 'Token tidak valid.' },
        { status: 401 }
      )
    }
  }

  // Page routes - check authentication via cookies
  const token = request.cookies.get('auth-token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    const userRole = decoded.role

    // Check if user has access to the route
    const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || []
    const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))

    if (!hasAccess && !pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}