import { Eye } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function SupplierCard() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Leverancier naam</CardTitle>
        <p className="text-sm text-muted-foreground">Info</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Producten</h3>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>Product {index + 1}</span>
                <div className="flex gap-2">
                  <span>€ {(19.99 + index * 5).toFixed(2)}</span>
                  <span>Aantal: {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">Contact</h3>
          <div className="text-sm space-y-1">
            <p>Contactpersoon: Naam Persoon</p>
            <p>Telefoon: +31 6 12345678</p>
            <p>Email: contact@leverancier.nl</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <span className="text-xs text-muted-foreground">Laatst actief: Vandaag</span>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </CardFooter>
    </Card>
  )
}
