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

// Mock data for employees
const mockEmployees = [
  { id: 1, name: "Jan Jansen", email: "jan.jansen@voedselbank.nl", role: "directie", active: true },
  { id: 2, name: "Petra de Vries", email: "petra.devries@voedselbank.nl", role: "magazijn", active: true },
  { id: 3, name: "Kees Bakker", email: "kees.bakker@voedselbank.nl", role: "vrijwilliger", active: true },
  { id: 4, name: "Lisa van Dijk", email: "lisa.vandijk@voedselbank.nl", role: "vrijwilliger", active: true },
  { id: 5, name: "Mohammed El Amrani", email: "mohammed.elamrani@voedselbank.nl", role: "magazijn", active: true },
  { id: 6, name: "Sophie Visser", email: "sophie.visser@voedselbank.nl", role: "vrijwilliger", active: false },
]

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
  const [showInactive, setShowInactive] = useState(false)

  // Filter employees based on search term and active status
  const filteredEmployees = mockEmployees.filter(
    (employee) =>
      (employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (showInactive || employee.active),
  )

  // Toggle employee selection
  const toggleEmployeeSelection = (employeeId: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId],
    )
  }

  // Toggle all employees selection
  const toggleAllEmployees = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(filteredEmployees.map((employee) => employee.id))
    }
  }

  // Translate role to Dutch
  const translateRole = (role: string) => {
    switch (role) {
      case "directie":
        return "Directie"
      case "magazijn":
        return "Magazijnmedewerker"
      case "vrijwilliger":
        return "Vrijwilliger"
      default:
        return role
    }
  }

  return (
    <>
      <Header userRole="directie" userName="Admin Gebruiker" />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Medewerkers</h1>
            <p className="text-muted-foreground">Beheer de medewerkers van de voedselbank</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Voeg toe
            </Button>
            <Button variant="outline" disabled={selectedEmployees.length === 0}>
              <Trash className="mr-2 h-4 w-4" />
              Verwijderen
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op naam of email..."
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
              <Label htmlFor="showInactive">Toon inactieve medewerkers</Label>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter op rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle rollen</SelectItem>
                <SelectItem value="directie">Directie</SelectItem>
                <SelectItem value="magazijn">Magazijnmedewerker</SelectItem>
                <SelectItem value="vrijwilliger">Vrijwilliger</SelectItem>
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
                          checked={
                            selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0
                          }
                          onCheckedChange={toggleAllEmployees}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3">Naam</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Rol</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedEmployees.includes(employee.id)}
                            onCheckedChange={() => toggleEmployeeSelection(employee.id)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{employee.name}</td>
                      <td className="px-4 py-3">{employee.email}</td>
                      <td className="px-4 py-3">{translateRole(employee.role)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            employee.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {employee.active ? "Actief" : "Inactief"}
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
                              employee.active
                                ? "text-red-500 hover:text-red-700"
                                : "text-green-500 hover:text-green-700"
                            }
                          >
                            {employee.active ? "Deactiveren" : "Activeren"}
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
