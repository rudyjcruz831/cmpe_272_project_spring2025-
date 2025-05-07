"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
          <p className="mt-2 text-gray-600">
            {error === "Configuration"
              ? "There is a problem with the server configuration."
              : "An error occurred during authentication."}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <Button asChild>
              <Link href="/auth/signin">Try Again</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
