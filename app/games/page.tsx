import { getGames } from "@/app/actions/games"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function GamesPage() {
    const games = await getGames()

    return (
        <main className="min-h-screen bg-background pb-20">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Pokemon Games
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Explore the various generations and regions of the Pokemon world.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <Link href={`/games/${game.id}`} key={game.id}>
                            <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
                                <CardHeader>
                                    <CardTitle className="capitalize flex justify-between items-center">
                                        {game.name.replace(/-/g, " ")}
                                        <Badge variant="secondary">ID: {game.id}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Click to see key features, towns, and Pokemon from this version group.
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    )
}
