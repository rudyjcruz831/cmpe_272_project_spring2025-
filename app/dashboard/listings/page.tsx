"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SearchBar } from "@/components/ui/search-bar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Property {
  address: string
  price: string
  beds: string
  baths: string
  area: string
  home_url: string
  image_url: string
}

export default function ListingsPage() {
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [bathrooms, setBathrooms] = useState(1)
  const [squareFootage, setSquareFootage] = useState([0, 5000])
  const [bedrooms, setBedrooms] = useState(1)
  const [properties, setProperties] = useState<Property[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const itemsPerPage = 9

  useEffect(() => {
    fetchProperties()
  }, [currentPage, searchQuery, priceRange, bathrooms, squareFootage, bedrooms])

  const fetchProperties = async () => {
    setIsLoading(true)
    try {
      // Construct query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
        bathrooms: bathrooms.toString(),
        minSqft: squareFootage[0].toString(),
        maxSqft: squareFootage[1].toString(),
        bedrooms: bedrooms.toString(),
        search: searchQuery,
      })

      // Replace with your actual API endpoint
      const response = await fetch(`/api/properties?${params}`)
      const data = await response.json()
      console.log(data)
      setProperties(data.properties)
      setTotalPages(Math.ceil(data.total / itemsPerPage))
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on new search

    fetch(`/api/scrape?query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error('Scrape API error:', err));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Property Listings</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Section */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            {/* Price Range Filter */}
            <div className="space-y-2">
              <Label>Price Range</Label>
              <Slider
                min={0}
                max={1000000}
                step={10000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${priceRange[0].toLocaleString()}</span>
                <span>${priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Bathrooms Filter */}
            <div className="space-y-2 mt-4">
              <Label>Bathrooms</Label>
              <Input
                type="number"
                min={1}
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
              />
            </div>

            {/* Square Footage Filter */}
            <div className="space-y-2 mt-4">
              <Label>Square Footage</Label>
              <Slider
                min={0}
                max={5000}
                step={100}
                value={squareFootage}
                onValueChange={setSquareFootage}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{squareFootage[0]} sqft</span>
                <span>{squareFootage[1]} sqft</span>
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div className="space-y-2 mt-4">
              <Label>Bedrooms</Label>
              <Input
                type="number"
                min={1}
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
              />
            </div>
          </Card>
        </div>

        {/* Results Section */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="aspect-video bg-gray-200 rounded-md mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.home_url} className="p-4">
                  <a href={property.home_url} target="_blank" rel="noopener noreferrer">
                    <div className="aspect-video bg-gray-200 rounded-md mb-4">
                      <img
                        src={property.image_url}
                        alt={property.address}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  </a>
                  <h3 className="font-semibold">{property.address}</h3>
                  <p className="text-gray-600">{property.price}</p>
                  <div className="flex gap-2 mt-2 text-sm text-gray-500">
                    <span>{property.beds}</span>
                    <span>•</span>
                    <span>{property.baths}</span>
                    <span>•</span>
                    <span>{property.area}</span>
                  </div>
                </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
