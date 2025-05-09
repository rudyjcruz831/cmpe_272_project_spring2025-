import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"

export default async function Home() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 text-center">
        <img 
          src="/afford_abode.jpg" 
          alt="Afford Abode Logo" 
          className="mx-auto h-15 w-auto mb-4" 
        />
        <h1 className="text-4xl font-bold"></h1>
        <p className="text-xl">Find the perfect Affordable Abode in your Area!</p>
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild>
            <Link href={session ? "/dashboard" : "/login"}>{session ? "Go to Dashboard" : "Sign In"}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
