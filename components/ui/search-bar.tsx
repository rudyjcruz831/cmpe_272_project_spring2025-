"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "./input"
import { Button } from "./button"
import { Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim())
      } else {
        try {
          setIsLoading(true)
          const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: searchQuery.trim() }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Search failed');
          }

          // Refresh the page to show new results
          router.refresh();
          toast.success('Search completed successfully');
        } catch (error) {
          console.error('Search error:', error);
          toast.error('Failed to perform search. Please try again.');
        } finally {
          setIsLoading(false)
        }
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
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2"
          variant="ghost"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  )
} 