"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function SearchPage() {
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [bathrooms, setBathrooms] = useState(1)
  const [squareFootage, setSquareFootage] = useState([0, 10000])
  const [bedrooms, setBedrooms] = useState(1)

  return (
    <div className="container mx-auto px-4 py-8">
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
          <h1 className="text-2xl font-bold mb-6">Search Results</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property cards will go here */}
            <Card className="p-4">
              <div className="aspect-video bg-gray-200 rounded-md mb-4"></div>
              <h3 className="font-semibold">Sample Property</h3>
              <p className="text-gray-600">$500,000</p>
              <div className="flex gap-2 mt-2 text-sm text-gray-500">
                <span>3 beds</span>
                <span>•</span>
                <span>2 baths</span>
                <span>•</span>
                <span>1,500 sqft</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 