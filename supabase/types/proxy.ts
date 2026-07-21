import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/supabase/types/database'

// Routes that don't require authentication
const authCallbackRoutes = ['/cambiar-contrasena']

const publicRoutes = [
  '/login',
  '/register',
  '/recuperar-contrasena',
  '/forgot-password',
  '/auth',
  '/consulta-pedido',
  '/nosotros',
]

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const pathname = request.nextUrl.pathname

  // Check if the current path is public
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route))
  const isRoot = pathname === '/'
  const isStatic = pathname.startsWith('/_next') || pathname.startsWith('/favicon')

  // Allow public routes, root, and static assets without auth
  if (isPublic || isRoot || isStatic) {
    return supabaseResponse
  }

  // Allow auth callback routes (recovery session may not exist yet server-side)
  const isAuthCallback = authCallbackRoutes.some((route) => pathname.startsWith(route))
  if (isAuthCallback) {
    return supabaseResponse
  }

  // Detect Supabase auth redirect with query params (PKCE flow)
  const hasAuthParams =
    request.nextUrl.searchParams.has('code') ||
    request.nextUrl.searchParams.has('token_hash') ||
    request.nextUrl.searchParams.has('token')
  if (hasAuthParams) {
    return supabaseResponse
  }

  // --- Protected routes ---

  // /account requires authentication
  if (pathname.startsWith('/account')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // /admin requires authentication + admin role
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const role = user.app_metadata?.role
    if (role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  return supabaseResponse
}