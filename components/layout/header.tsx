"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface HeaderProps {
  userRole: "directie" | "magazijn" | "vrijwilliger" | "klant"
  userName?: string
}

export default function Header({ userRole, userName = "Gebruiker" }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = {
    directie: [
      { href: "/dashboard/directie", label: "Home" },
      { href: "/medewerkers", label: "Medewerkers" },
      { href: "/producten", label: "Producten" },
      { href: "/klanten", label: "Klanten" },
      { href: "/leveranciers", label: "Leveranciers" },
      { href: "/voedselpakketten", label: "Voedselpakketten" },
    ],
    magazijn: [
      { href: "/dashboard/magazijn", label: "Home" },
      { href: "/producten", label: "Producten" },
      { href: "/leveranciers", label: "Leveranciers" },
    ],
    vrijwilliger: [
      { href: "/dashboard/vrijwilliger", label: "Home" },
      { href: "/producten", label: "Producten" },
      { href: "/voedselpakketten", label: "Voedselpakketten" },
    ],
    klant: [
      { href: "/dashboard/klant", label: "Home" },
      { href: "/voedselpakketten", label: "Voedselpakketten" },
    ],
  }

  const links = navLinks[userRole]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-2 py-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-lg font-medium rounded-md hover:bg-muted",
                      pathname === link.href ? "bg-muted" : "transparent",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Link href={`/dashboard/${userRole}`} className="font-bold text-lg">
            Voedselbank Maaskantje
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1 mx-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md hover:bg-muted",
                pathname === link.href ? "bg-muted" : "transparent",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center ml-auto gap-2">
          {isSearchOpen ? (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Zoeken..."
                className="w-full pl-8 pr-4"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Zoeken</span>
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Profiel</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
