"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/layout/header"
import { Plus } from "lucide-react"

// Mock data for food packages
const mockFoodPackages = [
  {
    id: 1,
    clientName: "Familie Jansen",
    createdAt: "2025-05-08",
    status: "ready",
    pickupDate: "2025-05-14",
    products: [
      { name: "Aardappelen", quantity: 2 },
      { name: "Melk", quantity: 3 },
      { name: "Brood", quantity: 2 },
      { name: "Pasta", quantity: 1 },
      { name: "Appels", quantity: 5 },
    ],
  },
  {
    id: 2,
    clientName: "Familie De Vries",
    createdAt: "2025-05-07",
    status: "ready",
    pickupDate: "2025-05-14",
    products: [
      { name: "Aardappelen", quantity: 1 },
      { name: "Melk", quantity: 2 },
      { name: "Brood", quantity: 1 },
      { name: "Soep", quantity: 3 },
      { name: "Chocolade", quantity: 1 },
    ],
  },
  {
    id: 3,
    clientName: "Familie Bakker",
    createdAt: "2025-05-06",
    status: "pending",
    pickupDate: "2025-05-14",
    products: [
      { name: "Aardappelen", quantity: 2 },
      { name: "Kaas", quantity: 1 },
      { name: "Brood", quantity: 2 },
      { name: "Sap", quantity: 2 },
    ],
  },
]

// Mock data for available products
const mockAvailableProducts = [
  { id: 1, name: "Aardappelen", category: "Aardappelen, groente en fruit", stock: 25, inPackage: false },
  { id: 2, name: "Melk", category: "Zuivel, plantaardig en eieren", stock: 18, inPackage: false },
  { id: 3, name: "Brood", category: "Bakkerij en banket", stock: 12, inPackage: false },
  { id: 4, name: "Pasta", category: "Pasta, rijst en wereldkeuken", stock: 30, inPackage: false },
  { id: 5, name: "Appels", category: "Aardappelen, groente en fruit", stock: 40, inPackage: false },
  { id: 6, name: "Soep", category: "Soepen, sauzen, kruiden en olie", stock: 15, inPackage: false },
  { id: 7, name: "Chocolade", category: "Snoep, koek, chips en chocolade", stock: 8, inPackage: false },
  { id: 8, name: "Luiers", category: "Baby, verzorging en hygiëne", stock: 5, inPackage: false },
  { id: 9, name: "Kaas", category: "Kaas en vleeswaren", stock: 10, inPackage: false },
  { id: 10, name: "Sap", category: "Frisdrank, sappen, koffie en thee", stock: 22, inPackage: false },
]

export default function FoodPackagesPage() {
  const [userRole, setUserRole] = useState("vrijwilliger") // For demo purposes
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])

  // Filter food packages based on search term
  const filteredFoodPackages = mockFoodPackages.filter((pkg) =>
    pkg.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter available products based on search term
  const filteredProducts = mockAvailableProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format date to DD-MM-YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("nl-NL")
  }

  // Toggle product selection
  const toggleProductSelection = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  return (
    <>
      <Header userRole={userRole as any} userName="Gebruiker" />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Voedselpakketten</h1>
            <p className="text-muted-foreground">
              {userRole === "klant"
                ? "Bekijk en stel uw voedselpakketten samen"
                : "Beheer de voedselpakketten voor klanten"}
            </p>
          </div>
          <Link href="/voedselpakketten/nieuw">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {userRole === "klant" ? "Nieuw pakket samenstellen" : "Nieuw voedselpakket"}
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="packages">
          <TabsList className="mb-4">
            <TabsTrigger value="packages">Voedselpakketten</TabsTrigger>
            {userRole !== "klant" && <TabsTrigger value="create">Pakket samenstellen</TabsTrigger>}
          </TabsList>

          <TabsContent value="packages">
            <div className="mb-6">
              <Input
                placeholder="Zoeken op naam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoodPackages.map((pkg) => (
                <Card key={pkg.id}>
                  <CardHeader>
                    <CardTitle>{pkg.clientName}</CardTitle>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">Aangemaakt: {formatDate(pkg.createdAt)}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          pkg.status === "ready" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {pkg.status === "ready" ? "Klaar" : "In behandeling"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ophalen op</p>
                      <p>{formatDate(pkg.pickupDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Inhoud</p>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {pkg.products.map((product, index) => (
                          <li key={index}>
                            {product.name} ({product.quantity}x)
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                      {userRole !== "klant" && pkg.status !== "ready" && <Button size="sm">Verwerken</Button>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {userRole !== "klant" && (
            <TabsContent value="create">
              <div className="grid md:grid-cols-[1fr_300px] gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Producten selecteren</h2>
                    <Input
                      placeholder="Zoeken..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>

                  <div className="grid gap-2">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className={`border ${
                          selectedProducts.includes(product.id)
                            ? "border-primary"
                            : product.stock === 0
                              ? "opacity-50"
                              : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`product-${product.id}`}
                                checked={selectedProducts.includes(product.id)}
                                onCheckedChange={() => product.stock > 0 && toggleProductSelection(product.id)}
                                disabled={product.stock === 0}
                              />
                              <div>
                                <Label htmlFor={`product-${product.id}`} className="font-medium">
                                  {product.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">{product.category}</p>
                              </div>
                            </div>
                            <div className="text-sm">
                              Voorraad:{" "}
                              <span className={product.stock === 0 ? "text-red-500" : ""}>{product.stock}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Card className="sticky top-20">
                    <CardHeader>
                      <CardTitle>Inhoud van pakket</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="client">Klant</Label>
                        <Input id="client" placeholder="Selecteer klant" className="mt-1" />
                      </div>

                      <div>
                        <Label>Geselecteerde producten</Label>
                        {selectedProducts.length === 0 ? (
                          <p className="text-sm text-muted-foreground mt-2">Geen producten geselecteerd</p>
                        ) : (
                          <ul className="mt-2 space-y-2">
                            {selectedProducts.map((id) => {
                              const product = mockAvailableProducts.find((p) => p.id === id)
                              return product ? (
                                <li key={id} className="flex justify-between text-sm">
                                  <span>{product.name}</span>
                                  <Input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    defaultValue="1"
                                    className="w-16 h-7 text-xs"
                                  />
                                </li>
                              ) : null
                            })}
                          </ul>
                        )}
                      </div>

                      <Button className="w-full">Verstuur</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </>
  )
}
