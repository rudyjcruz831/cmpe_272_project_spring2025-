"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

export default function ApiTestPage() {
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHelloWorld = async () => {
      try {
        const response = await fetch("http://localhost:8000/")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMessage(data.message)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchHelloWorld()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Hello World API Response</h2>
        
        {loading && (
          <p className="text-gray-600">Loading...</p>
        )}
        
        {error && (
          <div className="text-red-500">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-800">{message}</p>
          </div>
        )}
      </Card>
    </div>
  )
} 