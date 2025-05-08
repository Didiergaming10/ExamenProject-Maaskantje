import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Voedselbank Maaskantje</CardTitle>
          <CardDescription>Welkom bij het voedselbankbeheer systeem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground">Log in om toegang te krijgen tot het systeem</p>
          </div>
          <div className="flex flex-col space-y-2">
            <Link href="/login">
              <Button className="w-full">Inloggen</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Account aanmaken
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">© 2025 Voedselbank Maaskantje</p>
        </CardFooter>
      </Card>
    </div>
  )
}
