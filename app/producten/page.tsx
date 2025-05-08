"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from "@/components/layout/header"
import { ArrowUpDown, Plus } from "lucide-react"

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "Aardappelen",
    category: "Aardappelen, groente en fruit",
    ean: "8712345678901",
    stock: 25,
    expiryDate: "2025-06-15",
  },
  {
    id: 2,
    name: "Melk",
    category: "Zuivel, plantaardig en eieren",
    ean: "8712345678902",
    stock: 18,
    expiryDate: "2025-05-20",
  },
  { id: 3, name: "Brood", category: "Bakkerij en banket", ean: "8712345678903", stock: 12, expiryDate: "2025-05-14" },
  {
    id: 4,
    name: "Pasta",
    category: "Pasta, rijst en wereldkeuken",
    ean: "8712345678904",
    stock: 30,
    expiryDate: "2025-12-31",
  },
  {
    id: 5,
    name: "Appels",
    category: "Aardappelen, groente en fruit",
    ean: "8712345678905",
    stock: 40,
    expiryDate: "2025-05-25",
  },
  {
    id: 6,
    name: "Soep",
    category: "Soepen, sauzen, kruiden en olie",
    ean: "8712345678906",
    stock: 15,
    expiryDate: "2025-08-10",
  },
  {
    id: 7,
    name: "Chocolade",
    category: "Snoep, koek, chips en chocolade",
    ean: "8712345678907",
    stock: 8,
    expiryDate: "2025-09-15",
  },
  {
    id: 8,
    name: "Luiers",
    category: "Baby, verzorging en hygiëne",
    ean: "8712345678908",
    stock: 5,
    expiryDate: "2026-01-20",
  },
  { id: 9, name: "Kaas", category: "Kaas en vleeswaren", ean: "8712345678909", stock: 10, expiryDate: "2025-06-05" },
  {
    id: 10,
    name: "Sap",
    category: "Frisdrank, sappen, koffie en thee",
    ean: "8712345678910",
    stock: 22,
    expiryDate: "2025-07-12",
  },
]

// Mock categories
const categories = [
  "Aardappelen, groente en fruit",
  "Kaas en vleeswaren",
  "Zuivel, plantaardig en eieren",
  "Bakkerij en banket",
  "Frisdrank, sappen, koffie en thee",
  "Pasta, rijst en wereldkeuken",
  "Soepen, sauzen, kruiden en olie",
  "Snoep, koek, chips en chocolade",
  "Baby, verzorging en hygiëne",
]

export default function ProductsPage() {
  const [sortField, setSortField] = useState("name")
  const [userRole, setUserRole] = useState("directie") // For demo purposes
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Filter products based on search term and selected categories
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.ean.includes(searchTerm)
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
    return matchesSearch && matchesCategory
  })

  // Sort products based on sort field
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortField === "name") return a.name.localeCompare(b.name)
    if (sortField === "category") return a.category.localeCompare(b.category)
    if (sortField === "stock") return a.stock - b.stock
    return 0
  })

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <>
      <Header userRole={userRole as any} userName="Gebruiker" />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Producten</h1>
            <p className="text-muted-foreground">Beheer de producten in de voorraad</p>
          </div>
          {userRole !== "klant" && (
            <div className="flex gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Product toevoegen
              </Button>
              {userRole === "directie" && <Button variant="outline">Verwijderen</Button>}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-[250px_1fr] gap-6">
          {/* Filters sidebar */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search" className="text-sm font-medium">
                    Zoeken
                  </Label>
                  <Input
                    id="search"
                    placeholder="Naam of EAN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Categorieën</Label>
                  <div className="space-y-2 mt-1">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="expiryDate" className="text-sm font-medium">
                    Houdbaar tot
                  </Label>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    <Input id="expiryDay" placeholder="DD" className="text-center" />
                    <Input id="expiryMonth" placeholder="MM" className="text-center" />
                    <Input id="expiryYear" placeholder="JJJJ" className="text-center" />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Dieetwensen</Label>
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="diet-pork" />
                      <Label htmlFor="diet-pork" className="text-sm font-normal">
                        Geen varkensvlees
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="diet-vegan" />
                      <Label htmlFor="diet-vegan" className="text-sm font-normal">
                        Veganistisch
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="diet-vegetarian" />
                      <Label htmlFor="diet-vegetarian" className="text-sm font-normal">
                        Vegetarisch
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products list */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => setSortField(sortField === "name" ? "name" : "name")}>
                Sorteer
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
              <div className="text-sm text-muted-foreground">{sortedProducts.length} producten gevonden</div>
            </div>

            <div className="grid gap-4">
              {sortedProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Naam</Label>
                        <p className="font-medium">{product.name}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Categorie</Label>
                        <p>{product.category}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">EAN-nummer</Label>
                        <p>{product.ean}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Voorraad</Label>
                        <p>{product.stock} stuks</p>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          Wijzig
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
