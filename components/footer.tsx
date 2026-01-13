import Link from "next/link"
import { Github, Twitter, Mail } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Pokémon AI
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            The ultimate AI-powered companion for your Pokémon journey. 
                            Discover, search, and explore the world of Pokémon with advanced AI tools.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Features</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/pokesearch" className="hover:text-primary transition-colors">PokéSearch</Link></li>
                            <li><Link href="/ai-search" className="hover:text-primary transition-colors">AI Search</Link></li>
                            <li><Link href="/battle-simulator" className="hover:text-primary transition-colors">Battle Sim</Link></li>
                            <li><Link href="/team-builder" className="hover:text-primary transition-colors">Team Builder</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Connect</h3>
                        <div className="flex gap-4">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="mailto:contact@pokemonai.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-muted-foreground">© {currentYear} Pokémon AI. All rights reserved.</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Powered by <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">PokeAPI</a>.
                        </p>
                    </div>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
