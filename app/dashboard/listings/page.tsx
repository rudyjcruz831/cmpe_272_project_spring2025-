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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import RecommendationsComponent from "../api-test/page"

interface PropertyWithScore extends Property {
  dealScore?: number | null;
  predictedPrice?: number | null;
  percentDifference?: number | null;
}

interface Recommendation {
  name: string;
  category: string;
  description: string;
  relevance_reason: string;
  relevance_score: number;
  distance?: string;
  google_maps_link?: string;
}

// Add utility cost estimation function
const getUtilityEstimate = (squareFootage: number): { min: number; max: number } => {
  if (squareFootage < 500) return { min: 150, max: 250 }
  if (squareFootage < 1000) return { min: 150, max: 250 }
  if (squareFootage < 1500) return { min: 250, max: 350 }
  if (squareFootage < 2000) return { min: 350, max: 450 }
  if (squareFootage < 2500) return { min: 450, max: 550 }
  return { min: 550, max: 550 }
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
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithScore | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Add initial load effect
  useEffect(() => {
    console.log("Initial load effect running...")
    // Calculate scores for all properties on initial load
    calculateScores(properties).catch(err => {
      console.error("Error in initial score calculation:", err)
    })
  }, []) // Empty dependency array means this runs once on mount

  // Add effect to load user info
  useEffect(() => {
    const loadUserInfo = async () => {
      setIsLoadingUserInfo(true)
      try {
        // First try the public directory
        let response = await fetch("/userinfo.json")
        
        // If not in public, try the model directory
        if (!response.ok) {
          response = await fetch("/model/userinfo.json")
        }
        
        if (!response.ok) {
          console.error("Failed to load user info. Status:", response.status)
          throw new Error(`Failed to load user info. Status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("Successfully loaded user info:", data)
        setUserInfo(data)
      } catch (error) {
        console.error("Error loading user info:", error)
        // Set a default user info if loading fails
        setUserInfo({
          occupation: "student",
          company: "tech",
          interests: ["tech"],
          transportation: ["walk"],
          completed: true,
          serverId: null
        })
      } finally {
        setIsLoadingUserInfo(false)
      }
    }
    loadUserInfo()
  }, [])

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
      // Test API connection first
      try {
        const testResponse = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            encoded_address: 0,
            beds: 2,
            baths: 2,
            area: 1000,
            price: 2000
          }),
        })
        console.log("Test API response status:", testResponse.status)
        if (!testResponse.ok) {
          throw new Error(`Test API call failed with status: ${testResponse.status}`)
        }
        const testData = await testResponse.json()
        console.log("Test API response:", testData)
      } catch (testErr) {
        console.error("Test API call failed:", testErr)
        throw new Error("API connection test failed")
      }

      const propertiesWithScores = await Promise.all(
        properties.map(async (property) => {
          try {
            // Use default values for missing or zero values
            const areaToUse = property.squareFootage === 0 ? 750 : property.squareFootage;
            const bathsToUse = property.bathrooms === 0 ? 1 : property.bathrooms;
            
            console.log(`Calculating score for property ${property.id}...`, {
              encoded_address: property.encodedAddress,
              beds: property.bedrooms,
              baths: bathsToUse,
              area: areaToUse,
              price: property.price,
              raw_area: property.squareFootage === 0 ? "ZERO_AREA" : property.squareFootage,
              raw_baths: property.bathrooms === 0 ? "ZERO_BATHS" : property.bathrooms
            })
            
            const response = await fetch("http://127.0.0.1:8000/predict", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                encoded_address: property.encodedAddress,
                beds: property.bedrooms,
                baths: bathsToUse,
                area: areaToUse,
                price: property.price
              }),
            })

            console.log(`Response status for property ${property.id}:`, response.status)
            
            if (!response.ok) {
              const errorText = await response.text()
              console.error(`HTTP error for property ${property.id}:`, {
                status: response.status,
                statusText: response.statusText,
                error: errorText,
                requestBody: {
                  encoded_address: property.encodedAddress,
                  beds: property.bedrooms,
                  baths: bathsToUse,
                  area: areaToUse,
                  price: property.price
                }
              })
              throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
            }

            const data = await response.json()
            console.log(`API response for property ${property.id}:`, data)
            
            if (!data.normalized_score || !data.predicted_price) {
              console.error(`Invalid response data for property ${property.id}:`, {
                data,
                requestBody: {
                  encoded_address: property.encodedAddress,
                  beds: property.bedrooms,
                  baths: bathsToUse,
                  area: areaToUse,
                  price: property.price
                }
              })
              throw new Error("Invalid response data")
            }

            return {
              ...property,
              dealScore: data.normalized_score,
              predictedPrice: data.predicted_price,
              percentDifference: data.percent_difference
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
              predictedPrice: null,
              percentDifference: null
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
      // Set all properties to have null scores on error
      setFilteredProperties(properties.map(property => ({
        ...property,
        dealScore: null,
        predictedPrice: null,
        percentDifference: null
      })))
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

    // Set filtered properties immediately with null scores
    setFilteredProperties(filtered.map(property => ({
      ...property,
      dealScore: null,
      predictedPrice: null,
      percentDifference: null
    })))

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
      const response = await fetch("http://127.0.0.1:8000/predict", {
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

  // Add function to fetch recommendations
  const fetchRecommendations = async (encodedAddress: number) => {
    if (!userInfo) {
      console.error("User info not loaded")
      return
    }

    setIsLoadingRecommendations(true)
    setShowRecommendations(true)
    setRecommendations([]) // Clear previous recommendations
    setFetchError(null) // Clear any previous errors

    const maxRetries = 2
    let currentTry = 0

    while (currentTry <= maxRetries) {
      try {
        // Get the address from the selected property
        const address = selectedProperty?.title || ""
        console.log(`Attempt ${currentTry + 1}/${maxRetries + 1}: Sending recommendations request for address:`, address)

        const requestBody = {
          address: address,
          radius: 5000 // Default radius in meters
        }
        console.log("Request body:", requestBody)

        const response = await fetch("http://127.0.0.1:8000/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })

        const responseText = await response.text()
        console.log("Raw API response:", responseText)

        if (!response.ok) {
          // Try to parse the error response
          let errorDetail = responseText
          try {
            const errorJson = JSON.parse(responseText)
            errorDetail = errorJson.detail || responseText
          } catch (e) {
            // If parsing fails, use the raw text
          }

          // Handle specific error cases
          if (errorDetail.includes("No recommendations found") || errorDetail.includes("Could not generate place recommendations")) {
            setFetchError("We couldn't find any recommendations for this location. Try adjusting the search radius.")
            setIsLoadingRecommendations(false)
            return
          }
          
          // Handle timeout errors
          if (errorDetail.includes("504") && errorDetail.includes("timeout") && currentTry < maxRetries) {
            currentTry++
            console.log(`Retry ${currentTry} due to timeout...`)
            continue
          }
          
          throw new Error(errorDetail)
        }

        // Try to parse the successful response
        let data
        try {
          data = JSON.parse(responseText)
          console.log("Parsed response data:", data)
        } catch (e) {
          console.error("Failed to parse API response:", e)
          throw new Error("Invalid response format from server")
        }

        // Handle different response formats
        let recommendationsData = []
        if (data.recommendations && Array.isArray(data.recommendations)) {
          recommendationsData = data.recommendations
        } else if (data.places && Array.isArray(data.places)) {
          recommendationsData = data.places
        } else if (Array.isArray(data)) {
          recommendationsData = data
        } else {
          console.error("Unexpected response format:", data)
          throw new Error("Invalid response format")
        }

        if (recommendationsData.length === 0) {
          setFetchError("No recommendations found for this location.")
          setIsLoadingRecommendations(false)
          return
        }

        // Log each recommendation to check google_maps_link
        console.log("Individual recommendations data:")
        recommendationsData.forEach((rec: Recommendation, index: number) => {
          console.log(`Recommendation ${index + 1}:`, {
            name: rec.name,
            category: rec.category,
            google_maps_link: rec.google_maps_link,
            has_maps_link: !!rec.google_maps_link
          })
        })

        console.log("Setting recommendations:", recommendationsData)
        setRecommendations(recommendationsData)
        setIsLoadingRecommendations(false)
        setShowRecommendations(true)
        console.log("States after setting:", {
          recommendations: recommendationsData,
          isLoading: false,
          showRecommendations: true,
          error: null
        })
        return // Success! Exit the retry loop
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        
        if (currentTry === maxRetries) {
          setFetchError(
            errorMessage.includes("504") && errorMessage.includes("timeout")
              ? "The request is taking longer than expected. Please try again."
              : errorMessage.includes("No recommendations found") || errorMessage.includes("Could not generate")
              ? "We couldn't find any recommendations for this location. Try adjusting the search radius."
              : errorMessage.includes("Unexpected response format") || errorMessage.includes("Invalid response format")
              ? "There was an issue processing the recommendations. Please try again."
              : "Failed to fetch recommendations. Please try again."
          )
          setRecommendations([])
          setIsLoadingRecommendations(false)
        } else {
          currentTry++
          console.log(`Retry ${currentTry} after error...`)
          await new Promise(resolve => setTimeout(resolve, 1000 * currentTry)) // Exponential backoff
          continue
        }
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {/* <div><RecommendationsComponent /></div> */}
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
                <SelectItem value="score-high">Listing Score: High to Low</SelectItem>
                <SelectItem value="score-low">Listing Score: Low to High</SelectItem>
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
                className="w-full [&>div>div]:!bg-[#8A9969]"
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
                className="w-full [&>div>div]:!bg-[#8A9969]"
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
              <Card 
                key={property.id} 
                className="p-4 pb-16 relative cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedProperty(property)}
              >
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
                        Original: {property.priceDisplay}
                      </span>
                    </>
                  ) : (
                    property.priceDisplay
                  )}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{property.bedroomsDisplay}</span>
                  <span>•</span>
                  <span>{property.bathroomsDisplay}</span>
                  <span>•</span>
                  <span>{property.squareFootageDisplay}</span>
                </div>
                <a 
                  href={property.homeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
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
                  percentDifference={property.percentDifference}
                />
              </Card>
            ))}
          </div>

          {/* Property Details Sheet */}
          <Sheet open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
              {selectedProperty && (
                <>
                  <SheetHeader>
                    <SheetTitle>{selectedProperty.title}</SheetTitle>
                    <SheetDescription>{selectedProperty.location}</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="aspect-video bg-gray-200 rounded-md">
                      <img
                        src={selectedProperty.imageUrl}
                        alt={selectedProperty.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Price</h4>
                        <p className="text-2xl font-bold text-green-600">
                          ${selectedProperty.price.toLocaleString()}/mo
                        </p>
                        {roommates > 0 && (
                          <p className="text-sm text-gray-500">
                            ${Math.round(selectedProperty.price / (roommates + 1)).toLocaleString()}/mo per person
                          </p>
                        )}
                        <Button
                          variant="outline"
                          className="w-25 mt-2"
                          onClick={() => fetchRecommendations(selectedProperty.encodedAddress)}
                          disabled={isLoadingRecommendations || isLoadingUserInfo}
                        >
                          {isLoadingUserInfo ? (
                            <span className="flex items-center gap-2">
                              <RotateCw className="h-4 w-4 animate-spin" />
                              Loading...
                            </span>
                          ) : isLoadingRecommendations ? (
                            <span className="flex items-center gap-2">
                              <RotateCw className="h-4 w-4 animate-spin" />
                              Finding Places...
                            </span>
                          ) : (
                            "Nearby Recommendations"
                          )}
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Property Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Bedrooms:</span>
                            <span className="ml-2">{selectedProperty.bedroomsDisplay}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Bathrooms:</span>
                            <span className="ml-2">{selectedProperty.bathroomsDisplay}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Square Footage:</span>
                            <span className="ml-2">{selectedProperty.squareFootage} sqft</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Deal Analysis Section */}
                    <div className="border-t pt-3">
                      <h4 className="font-medium text-base">Deal Analysis:</h4>

                      <div className="mt-1 flex items-start">
                        {/* Inline table */}
                        <div
                          className="
                            inline-grid grid
                            grid-cols-[auto_auto]
                            gap-x-2 gap-y-1
                            bg-white p-2 rounded-lg shadow-sm text-sm
                          "
                        >
                          <span>Similar Listings:</span>
                          <span className="text-right">
                            ${selectedProperty.predictedPrice?.toLocaleString() ?? "—"}
                          </span>

                          <span className="text-red-600">Difference:</span>
                          <span className="text-right text-red-600">
                            ↑ $
                            {Math.abs(
                              selectedProperty.price - (selectedProperty.predictedPrice ?? 0)
                            ).toLocaleString()}{" "}
                            ({selectedProperty.percentDifference?.toFixed(0) ?? "—"}%)
                          </span>

                          {/* Badge spanning two columns */}
                          <div className="col-span-2 flex justify-center pt-1">
                            <span
                              className={`
                                inline-block px-2 py-0.5 rounded-full text-white text-[0.6rem]
                                ${
                                  (selectedProperty.dealScore ?? 0) < 75
                                    ? "bg-red-500"
                                    : (selectedProperty.dealScore ?? 0) < 90
                                    ? "bg-orange-500"
                                    : (selectedProperty.dealScore ?? 0) < 100
                                    ? "bg-yellow-400"
                                    : (selectedProperty.dealScore ?? 0) < 115
                                    ? "bg-green-500"
                                    : "bg-green-700"
                                }
                              `}
                            >
                              {selectedProperty.dealScore != null
                                ? selectedProperty.dealScore < 75
                                  ? "Bad deal"
                                  : selectedProperty.dealScore < 90
                                  ? "Mediocre"
                                  : selectedProperty.dealScore < 100
                                  ? "Fair deal"
                                  : selectedProperty.dealScore < 115
                                  ? "Good deal"
                                  : "Exceptional"
                                : "Pending"}
                            </span>
                          </div>
                        </div>

                        {/* Colored circle with raw score */}
                       <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="ml-4 flex-shrink-0">
                                <div
                                  className={`
                                    w-10 h-10 rounded-full flex items-center justify-center
                                    text-white text-base font-semibold
                                    ${
                                      (selectedProperty.dealScore ?? 0) < 75
                                        ? "bg-red-500"
                                        : (selectedProperty.dealScore ?? 0) < 90
                                        ? "bg-orange-500"
                                        : (selectedProperty.dealScore ?? 0) < 100
                                        ? "bg-yellow-400"
                                        : (selectedProperty.dealScore ?? 0) < 115
                                        ? "bg-green-500"
                                        : "bg-green-700"
                                    }
                                  `}
                                >
                                  {selectedProperty.dealScore?.toFixed(0) ?? "—"}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="!p-2">
                              <ul className="space-y-1 text-xs">
                                <li><strong>Exceptional:</strong> 115+</li>
                                <li><strong>Good:</strong> 100–114</li>
                                <li><strong>Fair:</strong> 90–99</li>
                                <li><strong>Mediocre:</strong> 75–89</li>
                                <li><strong>Bad:</strong> &lt;75</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>





                    {/* Add new Cost Breakdown section */}
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium">Cost Breakdown</h4>
                      
                      {/* Monthly Rent */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Monthly Rent</span>
                          <span className="font-medium">${selectedProperty.price.toLocaleString()}/mo</span>
                        </div>
                        
                        {/* Estimated Utilities */}
                        {(() => {
                          const utilities = getUtilityEstimate(selectedProperty.squareFootage)
                          return (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Estimated Utilities</span>
                              <span className="font-medium">
                                ${utilities.min.toLocaleString()} - ${utilities.max.toLocaleString()}/mo
                              </span>
                            </div>
                          )
                        })()}
                        
                        {/* Security Deposit */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Security Deposit</span>
                          <span className="font-medium">${selectedProperty.price.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Lease Options */}
                      <div className="space-y-3 pt-2">
                        <h5 className="text-sm font-medium text-gray-700">Lease Options</h5>
                        
                        {/* 12 Month Lease */}
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">12 Month Lease</span>
                            <span className="font-medium">
                              ${(selectedProperty.price * 12).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Total cost including deposit: ${(selectedProperty.price * 13).toLocaleString()}
                          </div>
                        </div>
                        
                        {/* 6 Month Lease */}
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">6 Month Lease</span>
                            <span className="font-medium">
                              ${(selectedProperty.price * 6).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Total cost including deposit: ${(selectedProperty.price * 7).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Monthly Total with Utilities */}
                      <div className="bg-green-50 p-3 rounded-md mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Estimated Monthly Total</span>
                          {(() => {
                            const utilities = getUtilityEstimate(selectedProperty.squareFootage)
                            const total = selectedProperty.price + utilities.max
                            return (
                              <span className="font-medium text-green-700">
                                ${total.toLocaleString()}/mo
                              </span>
                            )
                          })()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Including rent and maximum estimated utilities
                        </div>
                      </div>
                    </div>

                    {selectedProperty.features && selectedProperty.features.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Features</h4>
                        <ul className="grid grid-cols-2 gap-2">
                          {selectedProperty.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-4">
                      <a
                        href={selectedProperty.homeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-[#8A9969] px-4 py-2 text-sm font-medium text-white hover:bg-[#8A9969]/90"
                      >
                        View Original Listing
                      </a>
                    </div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>

          {/* Recommendations Sheet */}
          <Sheet open={showRecommendations} onOpenChange={setShowRecommendations}>
            <SheetContent 
              side="left" 
              className="w-full sm:max-w-xl overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle>Nearby Points of Interest</SheetTitle>
                <SheetDescription>
                  {isLoadingRecommendations 
                    ? "Finding interesting places nearby..."
                    : recommendations && recommendations.length > 0
                    ? `Found ${recommendations.length} recommended places near ${selectedProperty?.title}`
                    : "No recommendations found"
                  }
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6">
                {isLoadingRecommendations && (
                  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                    {/* Animated loading spinner */}
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-[#8A9969] border-t-transparent rounded-full animate-spin"></div>
                      <div className="w-16 h-16 border-4 border-[#8A9969]/30 rounded-full absolute top-0"></div>
                    </div>
                    {/* Loading messages */}
                    <div className="text-center space-y-3">
                      <p className="text-lg font-medium text-[#8A9969]">Finding Recommendations</p>
                      <div className="space-y-1 text-sm text-gray-500">
                        <p>• Analyzing location data</p>
                        <p>• Checking nearby points of interest</p>
                        <p>• Matching with your preferences</p>
                        <p className="text-xs italic mt-2">This may take a few moments...</p>
                      </div>
                    </div>
                  </div>
                )}

                {!isLoadingRecommendations && fetchError && (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-lg font-medium text-red-500 mb-2">No Results Found</p>
                    <p className="mb-4">{fetchError}</p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => fetchRecommendations(selectedProperty?.encodedAddress || 0)}
                      >
                        Try Again
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        Tip: The recommendations system works best with complete addresses
                      </p>
                    </div>
                  </div>
                )}

                {!isLoadingRecommendations && !fetchError && recommendations && recommendations.length > 0 && (
                  <div className="space-y-6 animate-fadeIn">
                    {(recommendations as Recommendation[]).map((rec: Recommendation, index: number) => {
                      console.log(`Rendering recommendation ${index}:`, rec)
                      return (
                        <Card 
                          key={index} 
                          className="p-4 relative overflow-hidden transition-all duration-200 hover:shadow-lg"
                        >
                          {/* Relevance Score Badge */}
                          <div className="absolute top-4 right-4">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm text-gray-500">Relevance</span>
                              <div className="w-10 h-10 rounded-full bg-[#8A9969] flex items-center justify-center">
                                <span className="text-white font-semibold">{rec.relevance_score}/10</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 pr-16">
                            {/* Name and Category */}
                            <div>
                              <h3 className="text-lg font-semibold">{rec.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-1 bg-[#8A9969]/10 text-[#8A9969] rounded-full text-sm">
                                  {rec.category}
                                </span>
                                {rec.distance && (
                                  <span className="text-sm text-gray-500">
                                    {rec.distance}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            <div className="text-sm text-gray-600">
                              <p>{rec.description}</p>
                            </div>

                            {/* Relevance Reason */}
                            <div className="bg-gray-50 p-3 rounded-md">
                              <p className="text-sm">
                                <span className="font-medium">Why it's relevant: </span>
                                {rec.relevance_reason}
                              </p>
                            </div>

                            {/* Maps Link */}
                            {rec.google_maps_link && (
                              <div className="mt-3 pt-2 border-t">
                                <a
                                  href={rec.google_maps_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-[#8A9969] hover:text-[#8A9969]/80 transition-colors"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-map-pin"
                                  >
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  View on Google Maps
                                </a>
                              </div>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

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