"use client"

import { useState } from "react"
import { DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"

export function PriceRangeFilter() {
  const [priceRange, setPriceRange] = useState([1000, 3000])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 border-dashed">
          <DollarSign className="w-4 h-4 mr-2" />
          Price: ${priceRange[0]} - ${priceRange[1]}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium leading-none">Price Range</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">${priceRange[0]}</span>
                <span className="text-sm text-gray-500">-</span>
                <span className="text-sm text-gray-500">${priceRange[1]}</span>
              </div>
            </div>
            <Slider
              value={priceRange}
              min={0}
              max={5000}
              step={100}
              onValueChange={setPriceRange}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">$0</span>
              <span className="text-xs text-gray-500">$5,000+</span>
            </div>
          </div>
          <Button>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
