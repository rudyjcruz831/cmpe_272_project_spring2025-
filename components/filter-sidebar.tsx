import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

export function FilterSidebar() {
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="price-range">Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input id="min-price" placeholder="Min" type="number" />
            <Input id="max-price" placeholder="Max" type="number" />
          </div>
          <Slider defaultValue={[1000, 3000]} max={5000} min={0} step={100} />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span>$5,000+</span>
          </div>
        </div>

        <Separator />

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <Label className="text-sm font-medium">Bedrooms</Label>
            <ChevronDown className="w-4 h-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="grid grid-cols-5 gap-2">
              {["Any", "Studio", "1", "2", "3+"].map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="sm"
                  className={option === "Any" ? "bg-primary text-primary-foreground" : ""}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <Label className="text-sm font-medium">Bathrooms</Label>
            <ChevronDown className="w-4 h-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="grid grid-cols-5 gap-2">
              {["Any", "1", "1.5", "2", "2+"].map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="sm"
                  className={option === "Any" ? "bg-primary text-primary-foreground" : ""}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <Label className="text-sm font-medium">Amenities</Label>
            <ChevronDown className="w-4 h-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="grid gap-2">
              {[
                "In-unit Laundry",
                "Dishwasher",
                "Air Conditioning",
                "Balcony",
                "Gym",
                "Pool",
                "Parking",
                "Pets Allowed",
              ].map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox id={`amenity-${amenity}`} />
                  <label
                    htmlFor={`amenity-${amenity}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button className="mt-2">Apply Filters</Button>
      </CardContent>
    </Card>
  )
}
