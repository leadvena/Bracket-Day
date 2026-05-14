export type TournamentStatus = 'upcoming' | 'live' | 'completed'
export type MatchStatus = 'pending' | 'live' | 'completed'
export type EliminationFormat = 'single_elimination'

export interface Match {
  matchId: string
  round: number
  position: number
  team1: string
  team2: string
  score1: number | null
  score2: number | null
  winner: string | null
  status: MatchStatus
}

export interface Tournament {
  id?: string
  name: string
  sport: string
  customSport: string
  date: Date | null
  teamCount: 4 | 8 | 16
  format: EliminationFormat
  status: TournamentStatus
  adminUid: string
  createdAt: Date
  matches: Match[]
}
