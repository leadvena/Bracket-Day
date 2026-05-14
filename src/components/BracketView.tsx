import type { Match } from '@/types/tournament'
import { getMatchesForRound, getTotalRounds, getRoundName } from '@/lib/bracket'

interface BracketViewProps {
  matches: Match[]
  teamCount: number
  onAdvanceWinner?: (matchId: string, winner: string) => void
  onScoreChange?: (matchId: string, field: 'score1' | 'score2', value: number) => void
  onTeamChange?: (matchId: string, field: 'team1' | 'team2', value: string) => void
  editable?: boolean
}

export default function BracketView({
  matches,
  teamCount,
  onAdvanceWinner,
  onScoreChange,
  onTeamChange,
  editable = false,
}: BracketViewProps) {
  const totalRounds = getTotalRounds(teamCount)
  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1)

  return (
    <div className="overflow-x-auto pb-6">
      <div className="flex gap-16 min-w-max px-4">
        {rounds.map((round) => {
          const roundMatches = getMatchesForRound(matches, round)
          const isLastRound = round === totalRounds

          return (
            <div key={round} className="flex items-center">
              <div className="flex flex-col">
                <div className="text-[11px] uppercase tracking-[0.2em] font-black text-[#A855F7]/60 mb-6 text-center">
                  {getRoundName(round, totalRounds)}
                </div>
                <div
                  className="flex flex-col"
                  style={{
                    gap: `${Math.pow(2, round) * 16}px`,
                    paddingTop: `${(Math.pow(2, round) - 1) * 8}px`,
                  }}
                >
                  {roundMatches.map((match: Match) => (
                    <MatchCard
                      key={match.matchId}
                      match={match}
                      editable={editable}
                      onAdvanceWinner={onAdvanceWinner}
                      onScoreChange={onScoreChange}
                      onTeamChange={onTeamChange}
                    />
                  ))}
                </div>
              </div>

              {/* Connector SVG */}
              {!isLastRound && (
                <div className="w-16 h-full relative self-stretch">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {roundMatches.map((_, idx) => {
                      if (idx % 2 !== 0) return null
                      const verticalDist = Math.pow(2, round) * (64 + 16) // Card height + gap
                      const startY = idx * (verticalDist / 2) + 32 + (Math.pow(2, round) - 1) * 8 // Center of card
                      
                      return (
                        <g key={idx}>
                          {/* Upper horizontal to vertical */}
                          <path
                            d={`M 0,${startY} L 32,${startY} L 32,${startY + verticalDist/2} L 64,${startY + verticalDist/2}`}
                            className="bracket-connector"
                          />
                          {/* Lower horizontal to vertical */}
                          <path
                            d={`M 0,${startY + verticalDist} L 32,${startY + verticalDist} L 32,${startY + verticalDist/2}`}
                            className="bracket-connector"
                          />
                        </g>
                      )
                    })}
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface MatchCardProps {
  match: Match
  editable: boolean
  onAdvanceWinner?: (matchId: string, winner: string) => void
  onScoreChange?: (matchId: string, field: 'score1' | 'score2', value: number) => void
  onTeamChange?: (matchId: string, field: 'team1' | 'team2', value: string) => void
}

function MatchCard({ match, editable, onAdvanceWinner, onScoreChange, onTeamChange }: MatchCardProps) {
  const isActive = match.status === 'live'
  const isCompleted = match.status === 'completed'

  return (
    <div
      className={`w-64 rounded-xl overflow-hidden transition-all duration-500 ${
        isActive
          ? 'border border-[#A855F7] shadow-[0_0_12px_rgba(168,85,247,0.4)]'
          : 'border border-[#1F1F30]'
      } bg-[#13131F]`}
    >
      <TeamRow
        team={match.team1}
        score={match.score1}
        isWinner={match.winner === match.team1}
        isLoser={isCompleted && match.winner !== match.team1}
        editable={editable}
        onTeamChange={(v) => onTeamChange?.(match.matchId, 'team1', v)}
        onScoreChange={(v) => onScoreChange?.(match.matchId, 'score1', v)}
        onAdvance={() => match.team1 && onAdvanceWinner?.(match.matchId, match.team1)}
        canAdvance={editable && !isCompleted && !!match.team1}
        showAdvance={false}
      />
      <div className="h-px bg-[#1F1F30]" />
      <TeamRow
        team={match.team2}
        score={match.score2}
        isWinner={match.winner === match.team2}
        isLoser={isCompleted && match.winner !== match.team2}
        editable={editable}
        onTeamChange={(v) => onTeamChange?.(match.matchId, 'team2', v)}
        onScoreChange={(v) => onScoreChange?.(match.matchId, 'score2', v)}
        onAdvance={() => match.team2 && onAdvanceWinner?.(match.matchId, match.team2)}
        canAdvance={editable && !isCompleted && !!match.team2}
        showAdvance={false}
      />
      {editable && !isCompleted && (match.team1 || match.team2) && (
        <div className="px-3 py-2 border-t border-[#1F1F30] flex gap-2">
          {match.team1 && (
            <button
              onClick={() => onAdvanceWinner?.(match.matchId, match.team1)}
              className="flex-1 text-xs py-1.5 rounded-lg bg-[#A855F7]/20 text-[#A855F7] hover:bg-[#A855F7] hover:text-white transition-all duration-300 font-medium"
            >
              {match.team1} wins
            </button>
          )}
          {match.team2 && (
            <button
              onClick={() => onAdvanceWinner?.(match.matchId, match.team2)}
              className="flex-1 text-xs py-1.5 rounded-lg bg-[#A855F7]/20 text-[#A855F7] hover:bg-[#A855F7] hover:text-white transition-all duration-300 font-medium"
            >
              {match.team2} wins
            </button>
          )}
        </div>
      )}
    </div>
  )
}

interface TeamRowProps {
  team: string
  score: number | null
  isWinner: boolean
  isLoser: boolean
  editable: boolean
  onTeamChange: (v: string) => void
  onScoreChange: (v: number) => void
  onAdvance: () => void
  canAdvance: boolean
  showAdvance: boolean
}

function TeamRow({
  team, score, isWinner, isLoser, editable,
  onTeamChange, onScoreChange,
}: TeamRowProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2.5 ${
        isWinner
          ? 'bg-[#1A0F2E] border-l-[3px] border-l-[#A855F7]'
          : isLoser
          ? 'bg-[#0F0F18]'
          : ''
      }`}
    >
      {editable ? (
        <input
          value={team}
          onChange={(e) => onTeamChange(e.target.value)}
          placeholder="Team name"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#8B8FA8]/50 text-white min-w-0"
        />
      ) : (
        <span
          className={`flex-1 text-sm font-medium truncate ${
            isWinner ? 'text-[#A855F7]' : isLoser ? 'text-[#2A2A3A]' : 'text-white'
          }`}
        >
          {team || <span className="text-[#8B8FA8]/40 italic">TBD</span>}
        </span>
      )}
      {editable ? (
        <input
          type="number"
          value={score ?? ''}
          onChange={(e) => onScoreChange(parseInt(e.target.value) || 0)}
          placeholder="0"
          className="w-10 bg-transparent text-sm text-right outline-none text-[#A855F7] font-mono font-bold"
        />
      ) : (
        <span className={`text-sm font-bold font-mono w-6 text-right ${isWinner ? 'text-[#A855F7]' : 'text-[#8B8FA8]'}`}>
          {score ?? ''}
        </span>
      )}
    </div>
  )
}
