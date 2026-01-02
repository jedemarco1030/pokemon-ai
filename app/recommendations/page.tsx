"use client"

import { useAuth } from "@/components/auth-provider"
import { RecommendationsView } from "@/components/recommendations-view"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RecommendationsPage() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto text-center space-y-6">
                    <h1 className="text-4xl font-bold">Recommendations</h1>
                    <p className="text-muted-foreground">Please log in to see your personalized Pokemon recommendations.</p>
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <RecommendationsView user={user} />
            </div>
        </main>
    )
}
