"use server"

import prisma from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"

export async function getJournalEntries(userId: string) {
    try {
        return await prisma.journalEntry.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        })
    } catch (error) {
        console.error("Error fetching journal entries:", error)
        return []
    }
}

export async function createJournalEntry(userId: string, content: string) {
    try {
        // Generate AI analysis
        const { milestone, suggestion } = await analyzeJournalContent(content)

        const entry = await prisma.journalEntry.create({
            data: {
                user_id: userId,
                content: content,
                milestone: milestone,
                suggestion: suggestion
            }
        })

        revalidatePath("/journal")
        return { success: true, entry }
    } catch (error) {
        console.error("Error creating journal entry:", error)
        return { success: false, error: "Failed to create entry" }
    }
}

export async function deleteJournalEntry(id: string) {
    try {
        await prisma.journalEntry.delete({
            where: { id }
        })
        revalidatePath("/journal")
        return { success: true }
    } catch (error) {
        console.error("Error deleting journal entry:", error)
        return { success: false }
    }
}

async function analyzeJournalContent(content: string) {
    // This is a placeholder for AI analysis logic.
    // In a real app, you would call an LLM here.

    const lowerContent = content.toLowerCase()
    let milestone = "New Adventure Logged"
    let suggestion = "Keep exploring to find more Pokemon!"

    if (lowerContent.includes("gym") || lowerContent.includes("badge") || lowerContent.includes("beat")) {
        milestone = "Gym Progress Made"
        suggestion = "Make sure your team is balanced for the next Gym Leader's types!"
    } else if (lowerContent.includes("caught") || lowerContent.includes("catch")) {
        milestone = "New Pokemon Team Addition"
        suggestion = "Try using our Move Optimizer to build the best move set for your new catch!"
    } else if (lowerContent.includes("evolve") || lowerContent.includes("evolved")) {
        milestone = "Pokemon Evolution"
        suggestion = "Evolved Pokemon have higher base stats. Test their strength in the Battle Simulator!"
    } else if (lowerContent.includes("lost") || lowerContent.includes("difficult") || lowerContent.includes("hard")) {
        milestone = "Overcoming Challenges"
        suggestion = "Consider catching a different type of Pokemon to help with this area."
    }

    return { milestone, suggestion }
}
