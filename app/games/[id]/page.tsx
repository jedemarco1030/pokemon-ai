import { notFound } from "next/navigation"
import { getGameDetails } from "@/app/actions/games"
import { GameDetailsView } from "@/components/game-details-view"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function GameDetailsPage({ params }: PageProps) {
    const { id } = await params
    const game = await getGameDetails(id)

    if (!game) {
        notFound()
    }

    return <GameDetailsView game={game} />
}
