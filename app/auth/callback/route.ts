import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const redirectTo = requestUrl.searchParams.get("redirectTo") || "/dashboard"

    if (code) {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        return NextResponse.redirect(new URL(`/login?error=${error.message}`, request.url))
      }

      // Send session to your Go backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          user: data.user,
        }),
      })

      if (!response.ok) {
        console.error('Failed to sync with backend:', await response.text())
      }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL(redirectTo, request.url))
  } catch (error) {
    console.error("Error in auth callback:", error)
    return NextResponse.redirect(new URL("/login?error=An error occurred", request.url))
  }
} 