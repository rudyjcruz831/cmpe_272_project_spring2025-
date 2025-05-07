"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Building, LayoutDashboard, MessageSquare } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Listings",
    href: "/dashboard/listings",
    icon: Building,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden h-screen border-r md:block w-60">
      <div className="flex items-center h-16 px-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <img 
            src="/afford_abode_long.jpg" 
            alt="Afford Abode Logo" 
            className="h-12.5 w-auto" 
          />
        </Link>
      </div>
      <div className="py-4">
        <div className="px-4 py-2">
          <h2 className="px-2 mb-2 text-xs font-semibold tracking-tight text-muted-foreground">MANAGEMENT</h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start", pathname === item.href && "bg-secondary")}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
