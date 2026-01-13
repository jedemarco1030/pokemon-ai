import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-6">
            <div className="space-y-2">
                <h1 className="text-9xl font-extrabold text-primary/20">404</h1>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Lost in the Tall Grass?</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    The page you&apos;re looking for has vanished into the wild. Maybe a wild Abra used Teleport?
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                    <Link href="/">Back to Home</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/pokesearch" className="gap-2">
                        <Search className="h-4 w-4" />
                        Search Pokémon
                    </Link>
                </Button>
            </div>
        </div>
    )
}
