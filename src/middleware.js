import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
    // 1. Update session (refresh token)
    let response = await updateSession(request)

    // 2. Auth Protection Logic
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protected routes
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
    const isAdminDashboard = request.nextUrl.pathname.startsWith('/dashboard/admin')
    const isSignIn = request.nextUrl.pathname.startsWith('/sign-in')
    const isSignUp = request.nextUrl.pathname.startsWith('/sign-up')

    const hasAdminSession = request.cookies.get('admin_session')?.value === 'true'

    if (isDashboard && !user) {
        if (isAdminDashboard && hasAdminSession) {
            return response
        }
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    if ((isSignIn || isSignUp) && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
