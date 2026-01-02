"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { PokeChatView } from "@/components/pokechat-view"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function PokeChatOverlay() {
    const { user, loading } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    if (loading || !user) return null

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            <div
                className={cn(
                    "mb-4 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] transition-all duration-300 origin-bottom-right",
                    isOpen 
                        ? "opacity-100 scale-100 translate-y-0" 
                        : "opacity-0 scale-95 translate-y-4 pointer-events-none"
                )}
            >
                <div className="bg-background border-2 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <MessageCircle className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">PokeChat</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Assistant</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <PokeChatView user={user} isOverlay={true} />
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <Button
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95",
                    isOpen ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageCircle className="h-6 w-6" />
                )}
            </Button>
        </div>
    )
}
