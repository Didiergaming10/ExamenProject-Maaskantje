import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/layout/header"
import Link from "next/link"

export default function VrijwilligerDashboard() {
  return (
    <>
      <Header userRole="vrijwilliger" userName="Vrijwilliger Gebruiker" />
      <main className="container py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vrijwilliger Dashboard</h1>
            <p className="text-muted-foreground">Beheer voedselpakketten en voorraad</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voedselpakketten Vandaag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">3 nog samen te stellen</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Klanten Vandaag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Verwacht tussen 13:00 - 17:00</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lage Voorraad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Producten die bijna op zijn</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Voedselpakketten Vandaag</CardTitle>
              <CardDescription>Overzicht van de voedselpakketten voor vandaag</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Familie Jansen</p>
                    <p className="text-sm text-muted-foreground">Ophalen: 14:00</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Bekijken
                    </Button>
                    <Button size="sm">Samenstellen</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Familie De Vries</p>
                    <p className="text-sm text-muted-foreground">Ophalen: 14:30</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Bekijken
                    </Button>
                    <Button size="sm">Samenstellen</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Familie Bakker</p>
                    <p className="text-sm text-muted-foreground">Ophalen: 15:00</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Bekijken
                    </Button>
                    <Button size="sm">Samenstellen</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Snelle Acties</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link href="/voedselpakketten/nieuw">
                <Button className="w-full justify-start">Nieuw voedselpakket</Button>
              </Link>
              <Link href="/producten">
                <Button variant="outline" className="w-full justify-start">
                  Producten beheren
                </Button>
              </Link>
              <Link href="/voedselpakketten">
                <Button variant="outline" className="w-full justify-start">
                  Alle voedselpakketten
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
