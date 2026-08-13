import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

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
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Strict route protection
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')
  
  if (!user && !isAuthRoute) {
    // Redirect unauthenticated users to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    // Redirect authenticated users away from auth routes
    // Fetch the user's role from user_actor
    const { data: actor } = await supabase
      .from('user_actor')
      .select('role')
      .eq('user_id', user.id)
      .single()
      
    const userRole = actor?.role || 'admin' // Default to admin if none found
    
    const url = request.nextUrl.clone()
    url.pathname = `/${userRole}`
    return NextResponse.redirect(url)
  }

  // Strict route isolation (prevent Vendor from accessing PM routes, etc.)
  if (user && !isAuthRoute) {
    const pathname = request.nextUrl.pathname
    
    // Only fetch role if they are trying to access a role-specific route
    const roleRoutes = ['/admin', '/pm', '/engineer', '/vendor', '/client', '/superadmin']
    const matchingRoute = roleRoutes.find(route => pathname.startsWith(route))
    
    if (matchingRoute) {
      const { data: actor } = await supabase
        .from('user_actor')
        .select('role')
        .eq('user_id', user.id)
        .single()
        
      const userRole = actor?.role || 'admin'
      const expectedRoute = `/${userRole}`
      
      if (matchingRoute !== expectedRoute) {
        // Unauthorized role access, redirect to their correct dashboard
        const url = request.nextUrl.clone()
        url.pathname = expectedRoute
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
