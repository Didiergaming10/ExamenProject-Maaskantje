import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/layout/header"
import Link from "next/link"

export default function DirectieDashboard() {
  return (
    <>
      <Header userRole="directie" userName="Admin Gebruiker" />
      <main className="container py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welkom bij het beheersysteem van Voedselbank Maaskantje</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totaal Producten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">+12% vergeleken met vorige maand</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actieve Klanten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38</div>
              <p className="text-xs text-muted-foreground">+2 nieuwe klanten deze week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voedselpakketten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Uitgegeven deze week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leveranciers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 leveringen verwacht deze week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Maandoverzicht per productcategorie</CardTitle>
              <CardDescription>Verdeling van producten per categorie in de afgelopen maand</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Grafiek wordt hier weergegeven</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Maandoverzicht per postcode</CardTitle>
              <CardDescription>Verdeling van klanten per postcodegebied</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Grafiek wordt hier weergegeven</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Gebruikersbeheer</CardTitle>
              <CardDescription>Beheer medewerkers en klantaccounts</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link href="/medewerkers">
                <Button variant="outline" className="w-full justify-start">
                  Medewerkers beheren
                </Button>
              </Link>
              <Link href="/klanten">
                <Button variant="outline" className="w-full justify-start">
                  Klanten beheren
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Voorraad</CardTitle>
              <CardDescription>Beheer producten en leveranciers</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link href="/producten">
                <Button variant="outline" className="w-full justify-start">
                  Producten beheren
                </Button>
              </Link>
              <Link href="/leveranciers">
                <Button variant="outline" className="w-full justify-start">
                  Leveranciers beheren
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Voedselpakketten</CardTitle>
              <CardDescription>Overzicht en beheer van voedselpakketten</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/voedselpakketten">
                <Button variant="outline" className="w-full justify-start">
                  Voedselpakketten beheren
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
