"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User as UserIcon, Loader2, Trash2 } from "lucide-react"
import { sendMessageAction, getChatHistory, clearChatHistoryAction } from "@/app/actions/chat"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    created_at: Date
}

export function PokeChatView({ user, isOverlay = false }: { user: User, isOverlay?: boolean }) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    const fetchChatHistory = useCallback(async () => {
        setIsInitialLoading(true)
        const history = await getChatHistory(user.id)
        setMessages(history.map((m) => ({
            ...m,
            role: m.role as 'user' | 'assistant',
            created_at: new Date(m.created_at)
        })))
        setIsInitialLoading(false)
    }, [user.id])

    useEffect(() => {
        let isMounted = true;
        const loadHistory = async () => {
            if (isMounted) {
                await fetchChatHistory()
            }
        }
        loadHistory()
        return () => { isMounted = false }
    }, [fetchChatHistory])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userContent = input.trim()
        setInput("")
        
        // Optimistic update
        const tempUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userContent,
            created_at: new Date()
        }
        setMessages(prev => [...prev, tempUserMsg])
        
        setIsLoading(true)
        const result = await sendMessageAction(user.id, userContent)

        if (result.success && result.message) {
            setMessages(prev => [...prev, {
                ...result.message!,
                role: result.message!.role as 'user' | 'assistant',
                created_at: new Date(result.message!.created_at)
            }])
        } else {
            toast.error("Failed to send message")
            // Remove optimistic message if desired, but usually better to let user retry
        }
        setIsLoading(false)
    }

    const handleClearHistory = async () => {
        if (!confirm("Are you sure you want to clear your chat history?")) return
        
        const result = await clearChatHistoryAction(user.id)
        if (result.success) {
            setMessages([])
            toast.success("Chat history cleared")
        } else {
            toast.error("Failed to clear history")
        }
    }

    return (
        <Card className={cn(
            "flex flex-col mx-auto",
            isOverlay ? "h-full border-0 shadow-none" : "h-[calc(100vh-12rem)] max-w-4xl border-2"
        )}>
            {!isOverlay && (
                <CardHeader className="border-b bg-muted/30 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Bot className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">PokeChat</CardTitle>
                            <p className="text-xs text-muted-foreground">Your AI Pokemon Assistant</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleClearHistory} title="Clear history" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </CardHeader>
            )}
            
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4">
                    {isInitialLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-12">
                            <div className="bg-secondary p-4 rounded-full">
                                <Bot className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <div className="max-w-sm">
                                <h3 className="text-lg font-semibold">Welcome to PokeChat!</h3>
                                <p className="text-sm text-muted-foreground">
                                    Ask me anything about Pokemon types, strategies, evolution, or just say hello!
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md pt-4">
                                {["Tell me about Pikachu", "How to catch Pokemon?", "Building a best team", "What are Shiny Pokemon?"].map(suggestion => (
                                    <Button 
                                        key={suggestion} 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-xs justify-start"
                                        onClick={() => setInput(suggestion)}
                                    >
                                        {suggestion}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                            {message.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                        </div>
                                        <div className={`p-3 rounded-2xl ${message.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none'}`}>
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            <p className={`text-[10px] mt-1 opacity-70 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                                {message.created_at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-3 max-w-[80%]">
                                        <div className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                                            <Bot className="w-5 h-5" />
                                        </div>
                                        <div className="bg-muted p-3 rounded-2xl rounded-tl-none">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
            
            <CardFooter className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
