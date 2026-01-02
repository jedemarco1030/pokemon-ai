"use server"

import prisma from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"

export async function getChatHistory(userId: string) {
    try {
        return await prisma.chatMessage.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'asc' }
        })
    } catch (error) {
        console.error("Error fetching chat history:", error)
        return []
    }
}

export async function sendMessageAction(userId: string, content: string) {
    try {
        // Save user message
        await prisma.chatMessage.create({
            data: {
                user_id: userId,
                role: 'user',
                content: content
            }
        })

        // Generate AI response
        const response = await generateAIResponse(content)

        // Save AI response
        const aiMessage = await prisma.chatMessage.create({
            data: {
                user_id: userId,
                role: 'assistant',
                content: response
            }
        })

        revalidatePath("/")
        return { success: true, message: aiMessage }
    } catch (error) {
        console.error("Error sending message:", error)
        return { success: false, error: "Failed to send message" }
    }
}

export async function clearChatHistoryAction(userId: string) {
    try {
        await prisma.chatMessage.deleteMany({
            where: { user_id: userId }
        })
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error clearing chat history:", error)
        return { success: false }
    }
}

async function generateAIResponse(query: string) {
    // This is a placeholder for actual LLM integration
    // In a real app, you would call OpenAI/Anthropic/Gemini here.

    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("hello") || lowerQuery.includes("hi")) {
        return "Hello there! I'm your AI Pokemon Assistant. How can I help you today?"
    }

    if (lowerQuery.includes("pikachu")) {
        return "Pikachu is an Electric-type Pokemon known as the Mouse Pokemon. It's the most famous Pokemon and the mascot of the series!"
    }

    if (lowerQuery.includes("best team") || lowerQuery.includes("team builder")) {
        return "Building a balanced team is key! You should consider having a mix of types like Water, Fire, and Grass. You can also use our 'Team Builder' tool for personalized suggestions!"
    }

    if (lowerQuery.includes("how to catch") || lowerQuery.includes("capture")) {
        return "To catch a Pokemon, it's best to lower its HP first and perhaps inflict a status condition like Sleep or Paralysis. Different Poke Balls also have different catch rates!"
    }

    if (lowerQuery.includes("shiny")) {
        return "Shiny Pokemon are rare variations with different colors. The odds of finding one in the wild are usually 1 in 4096!"
    }

    return "That's an interesting question! As a Pokemon Assistant, I can help you with strategies, type match-ups, and lore. Could you tell me more about what you're looking for?"
}
