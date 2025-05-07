"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-gray-600">Sign in with your Google account to access the dashboard</p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <Button onClick={handleSignIn} className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
