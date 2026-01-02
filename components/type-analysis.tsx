"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TypeAnalysisProps {
    members: { types?: string[] }[]
}

const typeColors: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-orange-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-cyan-400",
    fighting: "bg-red-600",
    poison: "bg-purple-500",
    ground: "bg-amber-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-stone-600",
    ghost: "bg-violet-600",
    dragon: "bg-indigo-600",
    dark: "bg-gray-700",
    steel: "bg-slate-500",
    fairy: "bg-pink-400",
}

export function TypeAnalysis({ members }: TypeAnalysisProps) {
    const validMembers = members.filter(m => m && m.types)
    
    if (validMembers.length === 0) return null

    const typeCounts: Record<string, number> = {}
    validMembers.forEach(m => {
        m.types?.forEach(type => {
            typeCounts[type] = (typeCounts[type] || 0) + 1
        })
    })

    const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])

    return (
        <Card>
            <CardHeader className="py-4">
                <CardTitle className="text-lg">Team Type Coverage</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {sortedTypes.map(([type, count]) => (
                        <div key={type} className="flex items-center gap-1">
                            <Badge className={`${typeColors[type] || "bg-gray-500"} text-white border-0 capitalize`}>
                                {type}
                            </Badge>
                            <span className="text-xs font-bold">x{count}</span>
                        </div>
                    ))}
                </div>
                {sortedTypes.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-4">
                        A well-balanced team usually has a variety of types to cover different weaknesses.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
