import { PokemonSearch } from "@/components/pokemon-search"

export default function PokeSearchPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <header className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                        {"PokéSearch"}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                        {
                            "Discover and explore Pokemon from the vast Pokemon universe. Search by name or browse the complete collection."
                        }
                    </p>
                </header>

                <PokemonSearch />
            </div>
        </main>
    )
}
