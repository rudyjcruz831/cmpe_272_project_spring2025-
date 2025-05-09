"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SearchBar } from "@/components/ui/search-bar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react"
import { properties, Property } from "@/data/properties"
import { DealScore } from "@/components/deal-score"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PropertyWithScore extends Property {
  dealScore?: number | null;
  predictedPrice?: number | null;
}

export default function ListingsPage() {
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [bathrooms, setBathrooms] = useState(0)
  const [squareFootage, setSquareFootage] = useState([0, 10000])
  const [bedrooms, setBedrooms] = useState(0)
  const [roommates, setRoommates] = useState(0)
  const [filteredProperties, setFilteredProperties] = useState<PropertyWithScore[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [sortBy, setSortBy] = useState<string>("")
  const [isLoadingScores, setIsLoadingScores] = useState(true)

  const resetFilters = () => {
    setPriceRange([0, 10000])
    setBathrooms(0)
    setSquareFootage([0, 10000])
    setBedrooms(0)
    setRoommates(0)
    setSearchQuery("")
    setSortBy("")
  }

  // Function to calculate scores for all properties
  const calculateScores = async (properties: Property[]) => {
    setIsLoadingScores(true)
    console.log(`Calculating scores for ${properties.length} properties...`)
    
    try {
      const propertiesWithScores = await Promise.all(
        properties.map(async (property) => {
          try {
            console.log(`Calculating score for property ${property.id}...`)
            const response = await fetch("http://localhost:8000/predict", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                encoded_address: property.encodedAddress,
                beds: property.bedrooms,
                baths: property.bathrooms,
                area: property.squareFootage,
                price: property.price
              }),
            })

            if (!response.ok) {
              const errorText = await response.text()
              console.error(`HTTP error for property ${property.id}:`, {
                status: response.status,
                statusText: response.statusText,
                error: errorText
              })
              throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
            }

            const data = await response.json()
            console.log(`Successfully calculated score for property ${property.id}:`, data)
            return {
              ...property,
              dealScore: data.normalized_score,
              predictedPrice: data.predicted_price
            }
          } catch (err) {
            console.error(`Error calculating score for property ${property.id}:`, {
              error: err instanceof Error ? err.message : 'Unknown error',
              property: {
                id: property.id,
                address: property.title,
                price: property.price,
                beds: property.bedrooms,
                baths: property.bathrooms,
                area: property.squareFootage
              }
            })
            return {
              ...property,
              dealScore: null,
              predictedPrice: null
            }
          }
        })
      )

      // Log summary of results
      const successfulScores = propertiesWithScores.filter(p => p.dealScore !== null).length
      console.log(`Score calculation complete. Results:`, {
        total: propertiesWithScores.length,
        successful: successfulScores,
        failed: propertiesWithScores.length - successfulScores
      })

      setFilteredProperties(propertiesWithScores)
    } catch (err) {
      console.error("Error in calculateScores:", err)
    } finally {
      setIsLoadingScores(false)
    }
  }

  useEffect(() => {
    // Apply filters
    let filtered = properties.filter(property => {
      const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1]
      
      // Handle bedroom range matching
      const matchesBedrooms = bedrooms === 0 || (() => {
        const rangeMatch = property.bedroomsDisplay.match(/(\d+)-(\d+)/)
        if (rangeMatch) {
          const minBeds = parseInt(rangeMatch[1])
          const maxBeds = parseInt(rangeMatch[2])
          return bedrooms >= minBeds && bedrooms <= maxBeds
        }
        return property.bedrooms >= bedrooms
      })()

      // Handle bathroom range matching
      const matchesBathrooms = bathrooms === 0 || (() => {
        const rangeMatch = property.bathroomsDisplay.match(/(\d+)-(\d+)/)
        if (rangeMatch) {
          const minBaths = parseInt(rangeMatch[1])
          const maxBaths = parseInt(rangeMatch[2])
          return bathrooms >= minBaths && bathrooms <= maxBaths
        }
        return property.bathrooms >= bathrooms
      })()

      const matchesSquareFootage = property.squareFootage >= squareFootage[0] && property.squareFootage <= squareFootage[1]
      const matchesSearch = searchQuery === "" || 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesPrice && matchesBathrooms && matchesSquareFootage && matchesBedrooms && matchesSearch
    })

    // Calculate scores for filtered properties
    calculateScores(filtered)
  }, [priceRange, bathrooms, squareFootage, bedrooms, searchQuery])

  // Apply sorting after scores are calculated
  useEffect(() => {
    if (!isLoadingScores && sortBy) {
      setFilteredProperties(prev => {
        const sorted = [...prev].sort((a, b) => {
          switch (sortBy) {
            case "price-low":
              return a.price - b.price
            case "price-high":
              return b.price - a.price
            case "score-high":
              return (b.dealScore ?? 0) - (a.dealScore ?? 0)
            case "score-low":
              return (a.dealScore ?? 0) - (b.dealScore ?? 0)
            default:
              return 0
          }
        })
        return sorted
      })
    }
  }, [sortBy, isLoadingScores])

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProperties = filteredProperties.slice(startIndex, endIndex)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const resetSearch = () => {
    setSearchQuery("")
  }

  // Test function for a specific listing
  const testListingScore = async () => {
    const testProperty = {
      id: "test",
      title: "517 Hope Ter Unit 1, Sunnyvale, CA 94087",
      description: "3 bedroom, 2 bathroom apartment in Sunnyvale",
      price: 3825, // Extracted from "$3,825/mo"
      bedrooms: 3, // Extracted from "3 beds"
      bathrooms: 2, // Extracted from "2 baths"
      bedroomsDisplay: "3 beds",
      bathroomsDisplay: "2 baths",
      squareFootage: 1200, // Using a reasonable default since it's missing
      imageUrl: "https://ssl.cdn-redfin.com/photo/rent/5f31c0e1-0108-4995-a2eb-9591b45b68e0/islphoto/genIsl.0_1.webp",
      location: "Sunnyvale, CA",
      type: "apartment",
      status: "available",
      features: [],
      homeUrl: "https://www.redfin.com/CA/Sunnyvale/517-Hope-Ter-94087/unit-1/apartment/195464274",
      encodedAddress: 0 // Using 0 as a test value
    }

    console.log("Testing score calculation for:", testProperty)
    
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encoded_address: testProperty.encodedAddress,
          beds: testProperty.bedrooms,
          baths: testProperty.bathrooms,
          area: testProperty.squareFootage,
          price: testProperty.price
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("HTTP error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        })
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()
      console.log("Score calculation result:", data)
      return data
    } catch (err) {
      console.error("Error calculating score:", err)
      throw err
    }
  }

  // Call the test function when the component mounts
  useEffect(() => {
    testListingScore().catch(console.error)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Rental Listings</h1>
        <div className="flex items-center">
          <div className="flex-1"></div>
          <div className="flex items-center gap-2">
            <div className="w-[400px]">
              <SearchBar onSearch={handleSearch} />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={resetSearch}
              className="h-10 w-10"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 flex justify-end">
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="score-high">Deal Score: High to Low</SelectItem>
                <SelectItem value="score-low">Deal Score: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
                max={10000}
                step={100}
                value={priceRange}
                onValueChange={setPriceRange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${priceRange[0].toLocaleString()}</span>
                <span>${priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div className="space-y-2 mt-4">
              <Label>Bedrooms</Label>
              <Input
                type="number"
                min={0}
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                placeholder="Any"
              />
            </div>

            {/* Bathrooms Filter */}
            <div className="space-y-2 mt-4">
              <Label>Bathrooms</Label>
              <Input
                type="number"
                min={0}
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                placeholder="Any"
              />
            </div>

            {/* Square Footage Filter */}
            <div className="space-y-2 mt-4">
              <Label>Square Footage</Label>
              <Slider
                min={0}
                max={10000}
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

            {/* Roommates Filter */}
            <div className="space-y-2 mt-4">
              <Label>Roommates</Label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">1 +</span>
                <Input
                  type="number"
                  min={0}
                  value={roommates}
                  onChange={(e) => setRoommates(Number(e.target.value))}
                  placeholder="0"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Reset Button */}
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>

            {/* Score Legend */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-semibold mb-3">Listing Score</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <span>Score pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-700"></div>
                  <span>115+ - Exceptional deal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500"></div>
                  <span>100-115 - Good deal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-400"></div>
                  <span>90-100 - Fair deal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500"></div>
                  <span>75-90 - Mediocre</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-500"></div>
                  <span>&lt;75 - Bad deal</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Section */}
        <div className="md:col-span-3">
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Showing {filteredProperties.length} properties
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProperties.map((property) => (
              <Card key={property.id} className="p-4 pb-16 relative">
                <div className="aspect-video bg-gray-200 rounded-md mb-4">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-gray-600">
                  {roommates > 0 ? (
                    <>
                      <span className="text-green-600 font-medium">
                        ${Math.round(property.price / (roommates + 1)).toLocaleString()}/mo
                      </span>
                      <span className="text-sm text-gray-500"> (per person)</span>
                      <br />
                      <span className="text-sm text-gray-500">
                        Original: ${property.price.toLocaleString()}/mo
                      </span>
                    </>
                  ) : (
                    `$${property.price.toLocaleString()}/mo`
                  )}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{property.bedroomsDisplay}</span>
                  <span>•</span>
                  <span>{property.bathroomsDisplay}</span>
                  <span>•</span>
                  <span>{property.squareFootage} sqft</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{property.location}</p>
                <a 
                  href={property.homeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
                >
                  View Source →
                </a>
                <DealScore
                  encodedAddress={property.encodedAddress}
                  beds={property.bedrooms}
                  baths={property.bathrooms}
                  area={property.squareFootage}
                  price={property.price}
                  score={property.dealScore}
                  predictedPrice={property.predictedPrice}
                />
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Show</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value))
                    setCurrentPage(1) // Reset to first page when changing items per page
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="12" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">per page</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}