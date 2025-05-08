"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Header from "@/components/layout/header"
import { Plus } from "lucide-react"

// Mock data for suppliers
const mockSuppliers = [
  {
    id: 1,
    name: "Supermarkt Hoogvliet",
    address: "Hoofdstraat 123, 5473 AB Maaskantje",
    contactName: "Peter Janssen",
    email: "p.janssen@hoogvliet.nl",
    phone: "06-12345678",
    nextDelivery: "2025-05-15",
    products: ["Aardappelen", "Melk", "Brood"],
  },
  {
    id: 2,
    name: "Bakkerij Van Doorn",
    address: "Kerkstraat 45, 5473 CD Maaskantje",
    contactName: "Lisa van Doorn",
    email: "info@bakkerijvandoorn.nl",
    phone: "06-23456789",
    nextDelivery: "2025-05-18",
    products: ["Brood", "Koekjes", "Taart"],
  },
  {
    id: 3,
    name: "Groenteboer Jansen",
    address: "Marktplein 7, 5473 EF Maaskantje",
    contactName: "Kees Jansen",
    email: "kees@groenteboerjansen.nl",
    phone: "06-34567890",
    nextDelivery: "2025-05-20",
    products: ["Aardappelen", "Appels", "Wortels"],
  },
  {
    id: 4,
    name: "Zuivelboer De Wit",
    address: "Boerenweg 12, 5473 GH Maaskantje",
    contactName: "Jan de Wit",
    email: "jan@zuivelboerdewit.nl",
    phone: "06-45678901",
    nextDelivery: "2025-05-22",
    products: ["Melk", "Kaas", "Yoghurt"],
  },
  {
    id: 5,
    name: "Slagerij Van Vliet",
    address: "Dorpsstraat 34, 5473 IJ Maaskantje",
    contactName: "Henk van Vliet",
    email: "info@slagerijvanvliet.nl",
    phone: "06-56789012",
    nextDelivery: "2025-05-25",
    products: ["Gehakt", "Kipfilet", "Worst"],
  },
  {
    id: 6,
    name: "Albert Heijn",
    address: "Winkelcentrum 1, 5473 KL Maaskantje",
    contactName: "Sandra Bakker",
    email: "s.bakker@ah.nl",
    phone: "06-67890123",
    nextDelivery: "2025-05-28",
    products: ["Diverse producten"],
  },
]

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [userRole, setUserRole] = useState("directie") // For demo purposes

  // Filter suppliers based on search term
  const filteredSuppliers = mockSuppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format date to DD-MM-YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("nl-NL")
  }

  return (
    <>
      <Header userRole={userRole as any} userName="Gebruiker" />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leveranciers</h1>
            <p className="text-muted-foreground">Beheer de leveranciers van de voedselbank</p>
          </div>
          {userRole === "directie" && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Toevoegen
            </Button>
          )}
        </div>

        <div className="mb-6">
          <Input
            placeholder="Zoeken op naam of contactpersoon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader>
                <CardTitle>{supplier.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Adres</p>
                  <p>{supplier.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact</p>
                  <p>{supplier.contactName}</p>
                  <p className="text-sm">{supplier.email}</p>
                  <p className="text-sm">{supplier.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Volgende levering</p>
                  <p>{formatDate(supplier.nextDelivery)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Product(en)</p>
                  <ul className="list-disc list-inside text-sm">
                    {supplier.products.map((product, index) => (
                      <li key={index}>{product}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Wijzig
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}
