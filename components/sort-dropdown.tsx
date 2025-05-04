import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SortDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10">
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <ArrowDownAZ className="w-4 h-4 mr-2" />
            <span>Price: Low to High</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArrowUpAZ className="w-4 h-4 mr-2" />
            <span>Price: High to Low</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="w-4 h-4 mr-2">↔️</span>
            <span>Square Footage</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="w-4 h-4 mr-2">🆕</span>
            <span>Newest</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
