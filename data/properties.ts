import rentalListings from '../data/rental_listings.json'

export interface Property {
  id: string
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  bedroomsDisplay: string
  bathroomsDisplay: string
  squareFootage: number
  imageUrl: string
  location: string
  type: "apartment" | "house" | "condo"
  status: "available" | "pending" | "sold"
  features: string[]
  homeUrl: string
}

// Helper functions to extract numeric values from strings
function extractPrice(priceStr: string): number {
  // Remove currency symbols and convert to number
  const numericStr = priceStr.replace(/[^0-9]/g, '')
  return parseInt(numericStr) || 0
}

function extractNumber(str: string): number {
  // Handle ranges (e.g., "1-2")
  const rangeMatch = str.match(/(\d+)-(\d+)/)
  if (rangeMatch) {
    // Return the average of the range
    return Math.round((parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2)
  }
  
  // Handle decimal values (e.g., "1.5")
  const decimalMatch = str.match(/(\d+\.?\d*)/)
  if (decimalMatch) {
    return parseFloat(decimalMatch[1])
  }
  
  // Fallback to first number
  const match = str.match(/\d+/)
  return match ? parseInt(match[0]) : 0
}

function extractSquareFootage(areaStr: string): number {
  // Remove commas and extract the number before "sq ft"
  const match = areaStr.match(/([\d,]+)\s*sq\s*ft/)
  if (match) {
    // Remove commas and convert to number
    return parseInt(match[1].replace(/,/g, ''))
  }
  return 0
}

// Transform the JSON data to match our Property interface
export const properties: Property[] = rentalListings.map((listing: any, index: number) => {
  // Extract numeric values from strings
  const price = extractPrice(listing.price)
  const bedrooms = extractNumber(listing.beds)
  const bathrooms = extractNumber(listing.baths)
  const squareFootage = extractSquareFootage(listing.area)

  // Extract city and state from address
  const addressParts = listing.address.split(',')
  const city = addressParts[1]?.trim() || ''
  const state = addressParts[2]?.trim() || ''
  const location = `${city}, ${state}`

  return {
    id: index.toString(),
    title: listing.address,
    description: `${bedrooms} bedroom, ${bathrooms} bathroom apartment in ${city}`,
    price: price,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    bedroomsDisplay: listing.beds,
    bathroomsDisplay: listing.baths,
    squareFootage: squareFootage,
    imageUrl: listing.image_url,
    location: location,
    type: "apartment",
    status: "available",
    features: [],
    homeUrl: listing.home_url
  }
}) 