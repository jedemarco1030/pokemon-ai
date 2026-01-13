"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, Plus, Trash2, Sparkles, Loader2, Calendar, Trophy, Lightbulb } from "lucide-react"
import { createJournalEntry, getJournalEntries, deleteJournalEntry } from "@/app/actions/journal"
import { toast } from "sonner"
// import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface JournalEntry {
    id: string
    content: string
    milestone: string | null
    suggestion: string | null
    created_at: Date
}

export function PokeJournalView({ user }: { user: User }) {
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [content, setContent] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const fetchEntries = useCallback(async () => {
        setIsLoading(true)
        const data = await getJournalEntries(user.id)
        setEntries(data.map((e) => ({
            ...e,
            created_at: new Date(e.created_at)
        })))
        setIsLoading(false)
    }, [user.id])

    useEffect(() => {
        // Only run on mount or when user.id changes
        let isMounted = true;
        const loadData = async () => {
            if (isMounted) {
                await fetchEntries()
            }
        }
        loadData()
        return () => { isMounted = false }
    }, [fetchEntries])

    const handleSaveEntry = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || isSaving) return

        setIsSaving(true)
        const result = await createJournalEntry(user.id, content)

        if (result.success && result.entry) {
            setEntries(prev => [{
                ...result.entry!,
                created_at: new Date(result.entry!.created_at)
            }, ...prev])
            setContent("")
            toast.success("Adventure logged!")
        } else {
            toast.error("Failed to save entry")
        }
        setIsSaving(false)
    }

    const handleDeleteEntry = async (id: string) => {
        if (!confirm("Are you sure you want to delete this entry?")) return

        const result = await deleteJournalEntry(id)
        if (result.success) {
            setEntries(prev => prev.filter(e => e.id !== id))
            toast.success("Entry deleted")
        } else {
            toast.error("Failed to delete entry")
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
                        <Book className="w-8 h-8 text-primary" />
                        PokéJournal
                    </h1>
                    <p className="text-muted-foreground">Document your Pokémon journey and get AI-powered insights.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Entry Form */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Log Your Adventure</CardTitle>
                            <CardDescription>What happened in your Pokémon journey today?</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveEntry} className="space-y-4">
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="e.g., Today I finally caught a Dratini in the Safari Zone! It took 50 Great Balls but it was worth it..."
                                    className="min-h-[200px] resize-none"
                                    disabled={isSaving}
                                />
                                <Button type="submit" className="w-full gap-2" disabled={isSaving || !content.trim()}>
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Log Adventure
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {entries.length > 0 && (
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-primary" />
                                    Latest Milestone
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-bold text-lg">{entries[0].milestone}</p>
                                {entries[0].suggestion && (
                                    <div className="mt-4 p-3 bg-background rounded-md border text-sm flex gap-2">
                                        <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                        <p>{entries[0].suggestion}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* History */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Adventure History
                    </h2>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/30">
                            <p className="text-muted-foreground">Your journal is empty. Start your story above!</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[600px] pr-4">
                            <div className="space-y-6">
                                {entries.map((entry) => (
                                    <Card key={entry.id} className="relative group overflow-hidden">
                                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                                <Calendar className="w-4 h-4" />
                                                {format(entry.created_at, "PPP 'at' p")}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDeleteEntry(entry.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-base leading-relaxed whitespace-pre-wrap">
                                                {entry.content}
                                            </p>

                                            {(entry.milestone || entry.suggestion) && (
                                                <div className="grid md:grid-cols-2 gap-3 pt-4 border-t border-dashed">
                                                    {entry.milestone && (
                                                        <div className="flex gap-2 items-start text-sm">
                                                            <Trophy className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Milestone</p>
                                                                <p>{entry.milestone}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {entry.suggestion && (
                                                        <div className="flex gap-2 items-start text-sm">
                                                            <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">AI Suggestion</p>
                                                                <p>{entry.suggestion}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </div>
        </div>
    )
}
