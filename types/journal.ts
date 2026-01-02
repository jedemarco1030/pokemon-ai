export interface JournalEntry {
    id: string
    user_id: string
    content: string
    milestone: string | null
    suggestion: string | null
    created_at: Date
    updated_at: Date
}
