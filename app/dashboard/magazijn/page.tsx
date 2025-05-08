import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/layout/header"
import Link from "next/link"

export default function MagazijnDashboard() {
  return (
    <>
      <Header userRole="magazijn" userName="Magazijn Medewerker" />
      <main className="container py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Magazijn Dashboard</h1>
            <p className="text-muted-foreground">Beheer producten en leveranciers</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totaal Producten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">12 producten bijna verlopen</p>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lage Voorraad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">Producten die aangevuld moeten worden</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recente Leveringen</CardTitle>
              <CardDescription>Overzicht van de meest recente leveringen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Supermarkt Hoogvliet</p>
                    <p className="text-sm text-muted-foreground">Ontvangen: 12 mei 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Bakkerij Van Doorn</p>
                    <p className="text-sm text-muted-foreground">Ontvangen: 10 mei 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Groenteboer Jansen</p>
                    <p className="text-sm text-muted-foreground">Ontvangen: 8 mei 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Verwachte Leveringen</CardTitle>
              <CardDescription>Overzicht van aankomende leveringen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Albert Heijn</p>
                    <p className="text-sm text-muted-foreground">Verwacht: 15 mei 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Zuivelboer De Wit</p>
                    <p className="text-sm text-muted-foreground">Verwacht: 18 mei 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Slagerij Van Vliet</p>
                    <p className="text-sm text-muted-foreground">Verwacht: 20 mei 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Snelle Acties</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link href="/producten">
                <Button variant="outline" className="w-full justify-start">
                  Producten beheren
                </Button>
              </Link>
              <Link href="/leveranciers">
                <Button variant="outline" className="w-full justify-start">
                  Leveranciers bekijken
                </Button>
              </Link>
              <Link href="/producten?filter=expiring">
                <Button variant="outline" className="w-full justify-start">
                  Bijna verlopen producten
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
