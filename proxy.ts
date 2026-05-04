import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Inicializar Supabase (Lógica recomendada para SSR)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
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

  // 2. Verificación de sesión (Optimistic Check)
  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.app_metadata?.role // El rol suele venir en el JWT (app_metadata)
  const { pathname } = request.nextUrl

  // 3. Lógica de Redirección Programática
  
  // Regla para ADMIN: Solo permite si el rol es 'admin'
  if (pathname.startsWith('/admin')) {
    if (!user || role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Regla para CUSTOMER: Protege el perfil/compras
  if (pathname.startsWith('/account') || pathname.startsWith('/checkout')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Regla para INVITADOS: Si ya están logueados, no necesitan ver el /login o /register
  if ((pathname === '/login' || pathname === '/register') && user) {
    const redirectPath = role === 'admin' ? '/admin/dashboard' : '/account'
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  return response
}

// 4. Configuración del Matcher
export const config = {
  matcher: [
    /*
     * Ejecutar el proxy en todas las rutas excepto:
     * - api (rutas de servidor)
     * - _next/static y _next/image (archivos optimizados)
     * - Archivos con extensión (imágenes, iconos, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}