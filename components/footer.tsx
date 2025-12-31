export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="text-center sm:text-left">
                        <p className="text-sm text-muted-foreground">© {currentYear} Pokemon AI. All rights reserved.</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Powered by PokeAPI. Discover, search, and explore the world of Pokemon.
                        </p>
                    </div>
                    <div className="flex gap-6 text-xs text-muted-foreground">
                        <a href="#" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            About
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
