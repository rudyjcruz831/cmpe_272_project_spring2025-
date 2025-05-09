"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { SearchBar } from "@/components/ui/search-bar"
import { Card } from "@/components/ui/card"
import jokesAndQuotes from "@/data/jokes_and_quotes.json"

function SkeletonCard() {
  return (
    <Card className="overflow-hidden transition-all">
      <div className="relative aspect-[4/3] bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="flex items-center gap-4">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
        </div>
        <div className="flex flex-wrap gap-1">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
        </div>
      </div>
    </Card>
  )
}

function CyclingContent() {
  const [currentContent, setCurrentContent] = useState("")
  const [contentType, setContentType] = useState<"fun_facts" | "jokes" | "quotes">("fun_facts")
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const getRandomContent = () => {
      const types = ["fun_facts", "jokes", "quotes"] as const
      const randomType = types[Math.floor(Math.random() * types.length)]
      const contentArray = jokesAndQuotes[randomType]
      const randomContent = contentArray[Math.floor(Math.random() * contentArray.length)]
      return { content: randomContent, type: randomType }
    }

    const updateContent = () => {
      // Start fade out
      setIsVisible(false)
      
      // After fade out, update content and fade in
      setTimeout(() => {
        const { content, type } = getRandomContent()
        setCurrentContent(content)
        setContentType(type)
        setIsVisible(true)
      }, 500) // Half second fade out
    }

    // Initial content
    const { content, type } = getRandomContent()
    setCurrentContent(content)
    setContentType(type)

    // Update every 7 seconds
    const interval = setInterval(updateContent, 7000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-8 text-center">
      <div 
        className={`inline-block p-4 rounded-lg bg-muted/50 transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-sm text-muted-foreground mb-1">
          {contentType === "fun_facts" ? "Did you know?" : contentType === "jokes" ? "Housing Humor" : "Rental Wisdom"}
        </p>
        <p className="text-lg font-medium">{currentContent}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    
    try {
      // Your search logic will go here
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate to listings page with search query
      router.push(`/dashboard/listings?q=${encodeURIComponent(query)}`)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  if (isLoading) {
    return null // or a loading spinner
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-center">Find The Perfect Rental</h1>
        <p className="text-muted-foreground text-center mb-8">
          Search through a Collection of Properties to find your Dream Rental
        </p>
        <SearchBar onSearch={handleSearch} />
        
        {/* Always show cycling content */}
        <CyclingContent />
        
        {/* Skeleton Loading Grid - Only shown when searching */}
        {isSearching && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
