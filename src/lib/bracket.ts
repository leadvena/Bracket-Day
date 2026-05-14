import type { Match } from '@/types/tournament'

export function generateMatches(teamCount: 4 | 8 | 16): Match[] {
  const matches: Match[] = []
  const rounds = Math.log2(teamCount)

  let matchId = 0
  for (let round = 1; round <= rounds; round++) {
    const matchesInRound = teamCount / Math.pow(2, round)
    for (let position = 0; position < matchesInRound; position++) {
      matches.push({
        matchId: `m${matchId++}`,
        round,
        position,
        team1: '',
        team2: '',
        score1: null,
        score2: null,
        winner: null,
        status: 'pending',
      })
    }
  }

  return matches
}

export function getRoundName(round: number, totalRounds: number): string {
  if (round === totalRounds) return 'Final'
  if (round === totalRounds - 1) return 'Semi-finals'
  if (round === totalRounds - 2) return 'Quarter-finals'
  return `Round ${round}`
}

export function getTotalRounds(teamCount: number): number {
  return Math.log2(teamCount)
}

export function getMatchesForRound(matches: Match[], round: number): Match[] {
  return matches
    .filter((m) => m.round === round)
    .sort((a, b) => a.position - b.position)
}

export function advanceWinner(
  matches: Match[],
  matchId: string,
  winner: string
): Match[] {
  const updated = matches.map((m) => ({ ...m }))
  const match = updated.find((m) => m.matchId === matchId)
  if (!match) return updated

  match.winner = winner
  match.status = 'completed'

  // Find the next round match this feeds into
  const nextRound = match.round + 1
  const nextPosition = Math.floor(match.position / 2)
  const nextMatch = updated.find(
    (m) => m.round === nextRound && m.position === nextPosition
  )

  if (nextMatch) {
    if (match.position % 2 === 0) {
      nextMatch.team1 = winner
    } else {
      nextMatch.team2 = winner
    }
  }

  return updated
}

export const SPORTS = [
  { value: 'basketball', label: 'Basketball', emoji: '🏀' },
  { value: 'football', label: 'Football', emoji: '⚽' },
  { value: 'volleyball', label: 'Volleyball', emoji: '🏐' },
  { value: 'badminton', label: 'Badminton', emoji: '🏸' },
  { value: 'tennis', label: 'Tennis', emoji: '🎾' },
  { value: 'table_tennis', label: 'Table Tennis', emoji: '🏓' },
  { value: 'chess', label: 'Chess', emoji: '♟️' },
  { value: 'esports', label: 'Esports', emoji: '🎮' },
  { value: 'other', label: 'Other / Custom', emoji: '🏆' },
]

export function getSportEmoji(sport: string): string {
  return SPORTS.find((s) => s.value === sport)?.emoji ?? '🏆'
}
