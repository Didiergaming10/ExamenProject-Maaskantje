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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would authenticate with a backend
    console.log("Logging in with:", email, password)

    // Simulate login and redirect based on role
    // In a real app, this would come from your authentication system
    if (email.includes("directie")) {
      router.push("/dashboard/directie")
    } else if (email.includes("magazijn")) {
      router.push("/dashboard/magazijn")
    } else if (email.includes("vrijwilliger")) {
      router.push("/dashboard/vrijwilliger")
    } else {
      router.push("/dashboard/klant")
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Voedselbank Maaskantje</CardTitle>
          <CardDescription>Inloggen</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="uw@email.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Wachtwoord</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Wachtwoord vergeten?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
            <Button type="submit" className="w-full">
              Inloggen
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            Nog geen account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Maak een account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
