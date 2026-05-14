import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Tournament, TournamentStatus } from '@/types/tournament'
import { getSportEmoji } from '@/lib/bracket'
import BracketView from '@/components/BracketView'
import { Trophy, Calendar } from 'lucide-react'

function StatusBadge({ status }: { status: TournamentStatus }) {
  if (status === 'live') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#A855F7] text-white glow-violet">
      <span className="w-2 h-2 rounded-full bg-white animate-pulse-dot" />
      LIVE
    </span>
  )
  if (status === 'completed') return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border border-[#A855F7] text-white">
      COMPLETED
    </span>
  )
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-[#1E1E30] text-[#8B8FA8]">
      UPCOMING
    </span>
  )
}

export default function PublicBracket() {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tournamentId) return
    const unsub = onSnapshot(doc(db, 'tournaments', tournamentId), (snap) => {
      if (snap.exists()) {
        setTournament({ id: snap.id, ...snap.data() } as Tournament)
      }
      setLoading(false)
    })
    return unsub
  }, [tournamentId])

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#08080F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="min-h-[100dvh] bg-[#08080F] flex flex-col items-center justify-center p-4 text-center">
        <Trophy size={48} className="text-[#8B8FA8] mb-4 opacity-20" />
        <h1 className="text-xl font-bold text-white mb-2">Tournament Not Found</h1>
        <p className="text-[#8B8FA8] mb-6">This bracket may have been deleted or the link is incorrect.</p>
        <Link to="/" className="text-[#A855F7] font-bold hover:underline">
          Back to BracketDay
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-[#08080F] flex flex-col">
      {/* Viewer Header */}
      <div className="bg-[#13131F] border-b border-[#1F1F30] px-4 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center sm:items-start sm:flex-row sm:justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
            <div className="flex items-center gap-3">
              <StatusBadge status={tournament.status} />
              {tournament.date && (
                <div className="flex items-center gap-1.5 text-[#8B8FA8] text-xs font-medium">
                  <Calendar size={14} />
                  {new Date((tournament.date as any).seconds * 1000).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-5xl sm:text-6xl">{getSportEmoji(tournament.sport)}</span>
              <div>
                <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-1">
                  {tournament.name}
                </h1>
                <p className="text-[#8B8FA8] text-sm uppercase tracking-[0.2em] font-medium">
                  Official Tournament Bracket
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2">
            <Link to="/" className="flex items-center gap-2 group">
               <span className="text-xs font-bold text-[#8B8FA8] group-hover:text-white transition-colors">Powered by</span>
               <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-[#A855F7] flex items-center justify-center">
                    <Trophy size={10} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">BracketDay</span>
               </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bracket Area */}
      <div className="flex-1 p-8 sm:p-12 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <BracketView
            matches={tournament.matches}
            teamCount={tournament.teamCount}
            editable={false}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-[#1F1F30] bg-[#08080F]">
        <p className="text-[#8B8FA8] text-xs mb-4">
          Watching a live tournament? This page updates in real-time.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-[#8B8FA8] hover:text-[#A855F7] text-xs font-bold transition-colors"
        >
          Are you the host? Manage Bracket
        </Link>
      </footer>
    </div>
  )
}
