"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample data for recent listings
const recentListings = [
  {
    id: "APT001",
    title: "Modern Downtown Loft",
    price: 1850,
    bedrooms: 1,
    bathrooms: 1,
    status: "Active",
    createdAt: "2023-04-15",
    views: 245,
  },
  {
    id: "APT002",
    title: "Spacious Family Apartment",
    price: 2400,
    bedrooms: 2,
    bathrooms: 2,
    status: "Active",
    createdAt: "2023-04-12",
    views: 187,
  },
  {
    id: "APT003",
    title: "Luxury Highrise Apartment",
    price: 3200,
    bedrooms: 3,
    bathrooms: 2,
    status: "Pending",
    createdAt: "2023-04-10",
    views: 320,
  },
  {
    id: "APT004",
    title: "Cozy Studio Apartment",
    price: 1200,
    bedrooms: 0,
    bathrooms: 1,
    status: "Active",
    createdAt: "2023-04-08",
    views: 156,
  },
  {
    id: "APT005",
    title: "Renovated Garden Apartment",
    price: 1650,
    bedrooms: 1,
    bathrooms: 1,
    status: "Inactive",
    createdAt: "2023-04-05",
    views: 98,
  },
]

export function RecentListingsTable() {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedListings = [...recentListings].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
      case "Inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
      default:
        return ""
    }
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("price")} className="p-0 font-medium">
                Price
                <ArrowUpDown className="w-4 h-4 ml-2" />
              </Button>
            </TableHead>
            <TableHead>Beds/Baths</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("createdAt")} className="p-0 font-medium">
                Date Added
                <ArrowUpDown className="w-4 h-4 ml-2" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("views")} className="p-0 font-medium">
                Views
                <ArrowUpDown className="w-4 h-4 ml-2" />
              </Button>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedListings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell className="font-medium">{listing.id}</TableCell>
              <TableCell>{listing.title}</TableCell>
              <TableCell>${listing.price}</TableCell>
              <TableCell>
                {listing.bedrooms === 0 ? "Studio" : listing.bedrooms} / {listing.bathrooms}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(listing.status)}>
                  {listing.status}
                </Badge>
              </TableCell>
              <TableCell>{listing.createdAt}</TableCell>
              <TableCell>{listing.views}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit listing</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Change status</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete listing</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
