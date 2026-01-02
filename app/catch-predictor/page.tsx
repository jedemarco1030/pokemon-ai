import { CatchPredictorView } from "@/components/catch-predictor-view"

export default async function CatchPredictorPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    const { id } = await searchParams
    const pokemonId = id ? parseInt(id) : undefined

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <CatchPredictorView initialPokemonId={pokemonId} />
            </div>
        </main>
    )
}
