export interface MoveRecommendation {
    move_name: string
    type: string
    category: 'physical' | 'special' | 'status'
    description: string
}

export interface MoveSetOptimization {
    pokemon_id: number
    pokemon_name: string
    role: string
    recommended_moves: MoveRecommendation[]
    recommended_item: string
    recommended_nature: string
    recommended_ability: string
    ev_spread: string
    strategy_insight: string
}
