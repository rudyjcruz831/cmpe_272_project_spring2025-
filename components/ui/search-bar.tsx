"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "./input"
import { Button } from "./button"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim())
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      }
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-12"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2"
          variant="ghost"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
} 