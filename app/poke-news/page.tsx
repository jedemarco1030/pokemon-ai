"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Newspaper, TrendingUp, TrendingDown, Minus, Info, Calendar, Zap, Loader2, ArrowRight } from "lucide-react"
import { getPokeNews, getMetaAnalysis } from "@/app/actions/poke-news"
import { PokeNewsItem, MetaAnalysis } from "@/types/poke-news"
import Image from "next/image"
import Link from "next/link"

export default function PokeNewsPage() {
    const { loading: authLoading } = useAuth()
    const [news, setNews] = useState<PokeNewsItem[]>([])
    const [meta, setMeta] = useState<MetaAnalysis | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newsData, metaData] = await Promise.all([
                    getPokeNews(),
                    getMetaAnalysis()
                ])
                setNews(newsData)
                setMeta(metaData)
            } catch (error) {
                console.error("Error fetching poke-news data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (authLoading || loading) {
        return (
            <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-medium">Analyzing the Meta...</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background pb-12">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Poké-News & Meta
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            AI-powered insights into the world of Pokémon and competitive trends.
                        </p>
                    </div>
                    {meta && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border">
                            <Calendar className="w-4 h-4" />
                            Last Meta Update: {new Date(meta.lastUpdated).toLocaleDateString()}
                        </div>
                    )}
                </div>

                <Tabs defaultValue="news" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="news" className="gap-2">
                            <Newspaper className="w-4 h-4" />
                            Latest News
                        </TabsTrigger>
                        <TabsTrigger value="meta" className="gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Meta Analyzer
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="news" className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {news.map((item) => (
                                <Card key={item.id} className="overflow-hidden group hover:border-primary/50 transition-all flex flex-col">
                                    <div className="relative h-48 w-full bg-muted overflow-hidden">
                                        {item.imageUrl && (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.title}
                                                fill
                                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                                unoptimized
                                            />
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <Badge variant={item.impact === "High" ? "destructive" : item.impact === "Medium" ? "default" : "secondary"}>
                                                {item.impact} Impact
                                            </Badge>
                                        </div>
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-primary/90 text-primary-foreground hover:bg-primary/90">
                                                {item.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="flex-1">
                                        <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {item.date}
                                        </div>
                                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">{item.title}</CardTitle>
                                        <CardDescription className="text-base mt-2 line-clamp-3">
                                            {item.content}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/10">
                                            Read Full Article
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="meta" className="space-y-8">
                        {meta && (
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <Card className="border-2 border-primary/20 bg-primary/5">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-2xl">
                                                <Zap className="w-6 h-6 text-primary" />
                                                AI Meta Overview
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-lg leading-relaxed italic text-foreground/90">
                                                &quot;{meta.analysis}&quot;
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold flex items-center gap-2 px-2">
                                            <TrendingUp className="w-6 h-6 text-primary" />
                                            Top Usage Trends
                                        </h3>
                                        <div className="grid gap-4">
                                            {meta.topPokemon.map((p) => (
                                                <Card key={p.pokemonId} className="hover:bg-muted/30 transition-colors">
                                                    <CardContent className="p-4 sm:p-6 flex items-center gap-4 sm:gap-6">
                                                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-secondary/50 rounded-xl overflow-hidden p-2">
                                                            <Image
                                                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.pokemonId}.png`}
                                                                alt={p.pokemonName}
                                                                fill
                                                                className="object-contain"
                                                                unoptimized
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                                <h4 className="text-xl font-bold truncate">{p.pokemonName}</h4>
                                                                <Badge variant="outline" className="font-mono">
                                                                    {p.usageRate}% Usage
                                                                </Badge>
                                                                {p.trend === "up" ? (
                                                                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/10 border-green-500/20 gap-1">
                                                                        <TrendingUp className="w-3 h-3" /> Rising
                                                                    </Badge>
                                                                ) : p.trend === "down" ? (
                                                                    <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/10 border-red-500/20 gap-1">
                                                                        <TrendingDown className="w-3 h-3" /> Falling
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 border-blue-500/20 gap-1">
                                                                        <Minus className="w-3 h-3" /> Stable
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-muted-foreground text-sm sm:text-base line-clamp-2">
                                                                {p.reason}
                                                            </p>
                                                        </div>
                                                        <div className="hidden sm:block">
                                                            <Button size="icon" variant="ghost" asChild>
                                                                <Link href={`/pokemon/${p.pokemonName.toLowerCase()}`}>
                                                                    <Info className="w-5 h-5" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <Card className="sticky top-24">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg">Meta Analysis Tips</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <span className="text-primary font-bold">1</span>
                                                </div>
                                                <p className="text-sm">Rising trends usually indicate a new counter has been discovered or a patch buffed a specific strategy.</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <span className="text-primary font-bold">2</span>
                                                </div>
                                                <p className="text-sm">Check the &apos;Reason&apos; for usage drops to see if you should retire a Pokémon from your active team.</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <span className="text-primary font-bold">3</span>
                                                </div>
                                                <p className="text-sm">Use the Team Builder to test how your current roster fares against these top usage threats.</p>
                                            </div>
                                            <Button className="w-full mt-4" asChild>
                                                <Link href="/team-builder">Go to Team Builder</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}
