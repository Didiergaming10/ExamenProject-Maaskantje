"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FamilyInfoPage() {
  const [familySize, setFamilySize] = useState("1")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would save family info to a backend
    console.log("Family info submitted")
    router.push("/dashboard/klant")
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Voedselbank Maaskantje</CardTitle>
          <CardDescription>Gezin informatie</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="familySize">Aantal gezinsleden</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="familySize"
                    type="number"
                    min="1"
                    value={familySize}
                    onChange={(e) => setFamilySize(e.target.value)}
                    className="w-20"
                  />
                  <span>{familySize}</span>
                </div>
              </div>

              {/* Family member 1 - always visible */}
              <div className="space-y-2 border p-4 rounded-md">
                <Label>Gezinslid 1 (hoofdaanvrager)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="firstName1">Voornaam</Label>
                    <Input id="firstName1" required />
                  </div>
                  <div>
                    <Label htmlFor="ageCategory1">Leeftijdscategorie</Label>
                    <Select defaultValue="volwassen">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer leeftijd" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baby">0-1 jaar</SelectItem>
                        <SelectItem value="peuter">1-3 jaar</SelectItem>
                        <SelectItem value="kind">4-12 jaar</SelectItem>
                        <SelectItem value="tiener">13-17 jaar</SelectItem>
                        <SelectItem value="volwassen">18+ jaar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Conditionally render additional family members based on familySize */}
              {Number.parseInt(familySize) > 1 && (
                <div className="space-y-2 border p-4 rounded-md">
                  <Label>Gezinslid 2</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="firstName2">Voornaam</Label>
                      <Input id="firstName2" required />
                    </div>
                    <div>
                      <Label htmlFor="ageCategory2">Leeftijdscategorie</Label>
                      <Select defaultValue="volwassen">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer leeftijd" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baby">0-1 jaar</SelectItem>
                          <SelectItem value="peuter">1-3 jaar</SelectItem>
                          <SelectItem value="kind">4-12 jaar</SelectItem>
                          <SelectItem value="tiener">13-17 jaar</SelectItem>
                          <SelectItem value="volwassen">18+ jaar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label>Dieetwensen</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="noPorc" />
                    <Label htmlFor="noPorc" className="text-sm font-normal">
                      Geen varkensvlees
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="vegan" />
                    <Label htmlFor="vegan" className="text-sm font-normal">
                      Veganistisch
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="vegetarian" />
                    <Label htmlFor="vegetarian" className="text-sm font-normal">
                      Vegetarisch
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allergies" />
                    <Label htmlFor="allergies" className="text-sm font-normal">
                      Allergisch
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergiesDetails">Allergieën (indien van toepassing)</Label>
                <Input id="allergiesDetails" placeholder="Bijv. Lactose, Gluten, Pinda's" />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Opslaan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
