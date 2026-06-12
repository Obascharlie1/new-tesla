import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({ request })

  // ── Admin routes ─────────────────────────────────────────────────────────
  // Protected by a signed cookie set on /api/admin/auth
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminToken = request.cookies.get('admin_token')?.value
    if (!adminToken || adminToken !== process.env.ADMIN_API_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return response
  }

  // ── User routes ──────────────────────────────────────────────────────────
  // Protected by Supabase session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — required to keep user logged in
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect unauthenticated users away from dashboard
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect authenticated users away from login only
  // /auth/register stays accessible so a new account can always be created
  if (pathname === '/auth/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/admin/:path*'],
}
