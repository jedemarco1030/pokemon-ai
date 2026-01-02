"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { usePokemonSearch } from "@/hooks/use-pokemon-search"
import Image from "next/image"

interface PokemonSearchModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (pokemon: { id: number, name: string, sprite: string, types: string[] }) => void
}

export function PokemonSearchModal({ open, onOpenChange, onSelect }: PokemonSearchModalProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const { pokemon, loading, searchPokemon } = usePokemonSearch()

    useEffect(() => {
        if (open) {
            const initSearch = async () => {
                setSearchQuery("")
                await searchPokemon("")
            }
            initSearch()
        }
    }, [open, searchPokemon])

    useEffect(() => {
        const trimmedQuery = searchQuery.trim()
        const debounceTimer = setTimeout(() => {
            const executeSearch = async () => {
                await searchPokemon(trimmedQuery)
            }
            executeSearch()
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [searchQuery, searchPokemon])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Search Pokemon</DialogTitle>
                </DialogHeader>
                <div className="px-6 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Type to search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                            autoFocus
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : pokemon.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No Pokemon found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {pokemon.map((p) => (
                                <div
                                    key={p.id}
                                    className="border rounded-lg p-3 cursor-pointer hover:border-primary hover:bg-accent transition-colors flex flex-col items-center gap-2 text-center"
                                    onClick={() => onSelect({
                                        id: p.id,
                                        name: p.name,
                                        sprite: p.sprite,
                                        types: p.types
                                    })}
                                >
                                    <div className="relative w-20 h-20">
                                        <Image
                                            src={p.sprite || "/placeholder.svg"}
                                            alt={p.name}
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                    <span className="text-sm font-bold capitalize truncate w-full">
                                        {p.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        #{p.id.toString().padStart(3, "0")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
