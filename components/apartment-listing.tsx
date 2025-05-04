import { Bath, BedDouble, Dumbbell, Car, Wifi, Droplets, Dog, Coffee, Home } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ApartmentListingProps {
  id: string
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  imageUrl: string
  amenities: string[]
}

export function ApartmentListing({
  id,
  title,
  address,
  price,
  bedrooms,
  bathrooms,
  sqft,
  imageUrl,
  amenities,
}: ApartmentListingProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "gym":
        return <Dumbbell className="w-3 h-3" />
      case "parking":
        return <Car className="w-3 h-3" />
      case "wifi":
        return <Wifi className="w-3 h-3" />
      case "pool":
        return <Droplets className="w-3 h-3" />
      case "pets allowed":
        return <Dog className="w-3 h-3" />
      case "concierge":
        return <Coffee className="w-3 h-3" />
      default:
        return <Home className="w-3 h-3" />
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-[4/3]">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="font-semibold bg-white">
            ${price.toLocaleString()}/mo
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-500">{address}</p>

        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4 text-gray-400" />
            <span>{bedrooms === 0 ? "Studio" : `${bedrooms} ${bedrooms === 1 ? "Bed" : "Beds"}`}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-gray-400" />
            <span>
              {bathrooms} {bathrooms === 1 ? "Bath" : "Baths"}
            </span>
          </div>
          <div className="text-gray-500">{sqft} sqft</div>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="outline" className="flex items-center gap-1 text-xs">
              {getAmenityIcon(amenity)}
              {amenity}
            </Badge>
          ))}
          {amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" variant="outline">
          <Link href={`/apartments/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
