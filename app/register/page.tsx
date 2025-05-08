"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would register with a backend
    console.log("Form submitted")
    router.push("/register/family-info")
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Voedselbank Maaskantje</CardTitle>
          <CardDescription>Account aanmaken</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Volledige naam</Label>
              <Input id="name" placeholder="Voornaam Achternaam" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="uw@email.nl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showConfirmPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountType">Account type</Label>
              <Select defaultValue="klant">
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="klant">Klant</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Medewerker accounts worden aangemaakt door de directie</p>
            </div>
            <Button type="submit" className="w-full">
              Account aanmaken
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            Al een account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Inloggen
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
