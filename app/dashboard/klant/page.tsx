import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/layout/header"
import Link from "next/link"

export default function KlantDashboard() {
  return (
    <>
      <Header userRole="klant" userName="Klant Gebruiker" />
      <main className="container py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welkom bij Voedselbank Maaskantje</h1>
            <p className="text-muted-foreground">Bekijk uw voedselpakketten en persoonlijke gegevens</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Uw Gegevens</CardTitle>
              <CardDescription>Persoonlijke informatie en gezinssamenstelling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Naam</p>
                    <p>Jan Jansen</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>jan.jansen@email.nl</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefoon</p>
                    <p>06-12345678</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gezinsleden</p>
                    <p>4 personen</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dieetwensen</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="bg-muted text-xs px-2 py-1 rounded-md">Geen varkensvlees</span>
                    <span className="bg-muted text-xs px-2 py-1 rounded-md">Lactose-intolerant</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Gegevens wijzigen
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Voedselpakket</CardTitle>
              <CardDescription>Uw huidige voedselpakket</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="font-medium">Klaar om op te halen</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ophalen op</p>
                  <p>Woensdag 14 mei, tussen 14:00 en 16:00</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Bekijk inhoud
                  </Button>
                  <Link href="/voedselpakketten/nieuw">
                    <Button size="sm">Nieuw pakket samenstellen</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Geschiedenis Voedselpakketten</CardTitle>
            <CardDescription>Overzicht van uw eerder ontvangen voedselpakketten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Voedselpakket #12345</p>
                  <p className="text-sm text-muted-foreground">Opgehaald op: 7 mei 2025</p>
                </div>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Voedselpakket #12344</p>
                  <p className="text-sm text-muted-foreground">Opgehaald op: 30 april 2025</p>
                </div>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Voedselpakket #12343</p>
                  <p className="text-sm text-muted-foreground">Opgehaald op: 23 april 2025</p>
                </div>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
