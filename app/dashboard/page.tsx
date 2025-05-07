import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { SearchBar } from "@/components/ui/search-bar"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-center">Find Your Perfect Home</h1>
        <p className="text-muted-foreground text-center mb-8">
          Search through our extensive collection of properties to find your dream home
        </p>
        <SearchBar />
      </div>
    </div>
  )
}
