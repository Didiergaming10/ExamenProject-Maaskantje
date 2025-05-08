"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/layout/header"
import { Plus, Search, Trash } from "lucide-react"

// Mock data for clients
const mockClients = [
  {
    id: 1,
    name: "Familie Jansen",
    email: "jansen@email.nl",
    phone: "06-12345678",
    address: "Hoofdstraat 123, 5473 AB Maaskantje",
    postalCode: "5473 AB",
    familySize: 4,
    dietaryRestrictions: ["Geen varkensvlees", "Lactose-intolerant"],
    active: true,
  },
  {
    id: 2,
    name: "Familie De Vries",
    email: "devries@email.nl",
    phone: "06-23456789",
    address: "Kerkstraat 45, 5473 CD Maaskantje",
    postalCode: "5473 CD",
    familySize: 3,
    dietaryRestrictions: ["Vegetarisch"],
    active: true,
  },
  {
    id: 3,
    name: "Familie Bakker",
    email: "bakker@email.nl",
    phone: "06-34567890",
    address: "Marktplein 7, 5473 EF Maaskantje",
    postalCode: "5473 EF",
    familySize: 5,
    dietaryRestrictions: [],
    active: true,
  },
  {
    id: 4,
    name: "Familie De Wit",
    email: "dewit@email.nl",
    phone: "06-45678901",
    address: "Boerenweg 12, 5473 GH Maaskantje",
    postalCode: "5473 GH",
    familySize: 2,
    dietaryRestrictions: ["Glutenvrij"],
    active: true,
  },
  {
    id: 5,
    name: "Familie Van Vliet",
    email: "vanvliet@email.nl",
    phone: "06-56789012",
    address: "Dorpsstraat 34, 5473 IJ Maaskantje",
    postalCode: "5473 IJ",
    familySize: 6,
    dietaryRestrictions: ["Geen varkensvlees"],
    active: false,
  },
]

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClients, setSelectedClients] = useState<number[]>([])
  const [showInactive, setShowInactive] = useState(false)

  // Filter clients based on search term and active status
  const filteredClients = mockClients.filter(
    (client) =>
      (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.postalCode.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (showInactive || client.active),
  )

  // Toggle client selection
  const toggleClientSelection = (clientId: number) => {
    setSelectedClients((prev) => (prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]))
  }

  // Toggle all clients selection
  const toggleAllClients = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([])
    } else {
      setSelectedClients(filteredClients.map((client) => client.id))
    }
  }

  return (
    <>
      <Header userRole="directie" userName="Admin Gebruiker" />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Klanten</h1>
            <p className="text-muted-foreground">Beheer de klanten van de voedselbank</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Voeg toe
            </Button>
            <Button variant="outline" disabled={selectedClients.length === 0}>
              <Trash className="mr-2 h-4 w-4" />
              Verwijderen
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op naam, email of postcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full md:w-[300px]"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showInactive"
                checked={showInactive}
                onCheckedChange={() => setShowInactive(!showInactive)}
              />
              <Label htmlFor="showInactive">Toon inactieve klanten</Label>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter op postcode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle postcodes</SelectItem>
                <SelectItem value="5473AB">5473 AB</SelectItem>
                <SelectItem value="5473CD">5473 CD</SelectItem>
                <SelectItem value="5473EF">5473 EF</SelectItem>
                <SelectItem value="5473GH">5473 GH</SelectItem>
                <SelectItem value="5473IJ">5473 IJ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th className="px-4 py-3">
                      <div className="flex items-center">
                        <Checkbox
                          checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                          onCheckedChange={toggleAllClients}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3">Naam</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Adres</th>
                    <th className="px-4 py-3">Gezinsgrootte</th>
                    <th className="px-4 py-3">Dieetwensen</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-b">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedClients.includes(client.id)}
                            onCheckedChange={() => toggleClientSelection(client.id)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{client.name}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p>{client.email}</p>
                          <p>{client.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p>{client.address}</p>
                          <p className="text-xs text-muted-foreground">{client.postalCode}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">{client.familySize} personen</td>
                      <td className="px-4 py-3">
                        {client.dietaryRestrictions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {client.dietaryRestrictions.map((restriction, index) => (
                              <span key={index} className="bg-muted text-xs px-2 py-1 rounded-md">
                                {restriction}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Geen</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            client.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {client.active ? "Actief" : "Inactief"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Bewerken
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={
                              client.active ? "text-red-500 hover:text-red-700" : "text-green-500 hover:text-green-700"
                            }
                          >
                            {client.active ? "Deactiveren" : "Activeren"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
