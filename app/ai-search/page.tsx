import { SemanticSearchView } from "@/components/semantic-search-view"

export default function SemanticSearchPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <header className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                        {"AI Semantic Search"}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {
                            "Describe the Pokémon you're looking for in natural language, and our AI will find them for you."
                        }
                    </p>
                </header>

                <SemanticSearchView />
            </div>
        </main>
    )
}
