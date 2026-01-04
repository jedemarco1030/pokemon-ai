import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Sparkles, Gamepad2, Swords, Newspaper, BookOpen, Search, Trophy, TrendingUp, Users } from "lucide-react"

export default function Home() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden border-b">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="container relative mx-auto px-4 text-center">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                        Pokemon AI
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                        The ultimate AI-powered companion for your Pokemon journey. From strategic battle analysis to semantic news tracking, we&apos;ve got everything a trainer needs.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" className="gap-2 text-lg cursor-pointer touch-manipulation active:scale-95 transition-transform">
                            <Link href="/pokesearch">
                                <Search className="h-5 w-5" />
                                Start Searching
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="gap-2 text-lg border-primary/50 hover:bg-primary/5 cursor-pointer touch-manipulation active:scale-95 transition-transform">
                            <Link href="/ai-search">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Try AI Search
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Powerful Features for Every Trainer</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Experience Pokemon like never before with our suite of AI-driven tools and features.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Battle Simulator */}
                    <Card className="hover:border-primary/50 transition-colors group">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <Swords className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>AI Battle Simulator</CardTitle>
                            <CardDescription>Test your skills against iconic Gym Leaders like Brock and Misty in our AI-powered battle arena.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="ghost" className="w-full justify-start px-0 hover:bg-transparent text-primary hover:text-primary/80">
                                <Link href="/battle-simulator" className="flex items-center gap-2">
                                    Go to Battle Simulator <TrendingUp className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Poke-News */}
                    <Card className="hover:border-primary/50 transition-colors group">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                                <Newspaper className="h-6 w-6 text-accent" />
                            </div>
                            <CardTitle>Poke-News & Meta</CardTitle>
                            <CardDescription>Stay ahead of the game with real-time semantic news and competitive meta-analysis.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="ghost" className="w-full justify-start px-0 hover:bg-transparent text-accent hover:text-accent/80">
                                <Link href="/poke-news" className="flex items-center gap-2">
                                    Analyze Meta Trends <TrendingUp className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Team Builder */}
                    <Card className="hover:border-primary/50 transition-colors group">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Pro Team Builder</CardTitle>
                            <CardDescription>Construct the perfect team and use our Move Optimizer to maximize your competitive edge.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="ghost" className="w-full justify-start px-0 hover:bg-transparent text-primary hover:text-primary/80">
                                <Link href="/team-builder" className="flex items-center gap-2">
                                    Build Your Team <TrendingUp className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* AI Journal */}
                    <Card className="hover:border-primary/50 transition-colors group">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                                <BookOpen className="h-6 w-6 text-accent" />
                            </div>
                            <CardTitle>Trainer&apos;s Journal</CardTitle>
                            <CardDescription>Document your journey and let AI summarize your milestones and provide growth suggestions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="ghost" className="w-full justify-start px-0 hover:bg-transparent text-accent hover:text-accent/80">
                                <Link href="/journal" className="flex items-center gap-2">
                                    Write Entry <TrendingUp className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Catch Predictor */}
                    <Card className="hover:border-primary/50 transition-colors group">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <Trophy className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Catch Predictor</CardTitle>
                            <CardDescription>Calculate your chances of success before throwing that Master Ball with our AI predictor.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="ghost" className="w-full justify-start px-0 hover:bg-transparent text-primary hover:text-primary/80">
                                <Link href="/catch-predictor" className="flex items-center gap-2">
                                    Predict Success <TrendingUp className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:border-primary/50 transition-colors group">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                                <Gamepad2 className="h-6 w-6 text-accent" />
                            </div>
                            <CardTitle>Minigames</CardTitle>
                            <CardDescription>Put your knowledge to the test with &quot;Who&apos;s That Pokemon?&quot; and other interactive challenges.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="ghost" className="w-full justify-start px-0 hover:bg-transparent text-accent hover:text-accent/80">
                                <Link href="/whos-that-pokemon" className="flex items-center gap-2">
                                    Play Now <TrendingUp className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    )
}
