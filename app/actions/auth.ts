"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateUserPassword(password: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        console.error("[updateUserPassword] Error updating password:", error.message)
        return { success: false, error: error.message }
    }

    revalidatePath("/settings")
    return { success: true }
}
