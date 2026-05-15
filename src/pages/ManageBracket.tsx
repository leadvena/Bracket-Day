import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Tournament, TournamentStatus, Match } from '@/types/tournament'
import { getSportEmoji, advanceWinner } from '@/lib/bracket'
import BracketView from '@/components/BracketView'
import { LayoutDashboard, Copy, Check, Link2 } from 'lucide-react'

export default function ManageBracket() {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const navigate = useNavigate()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!tournamentId) return
    const unsub = onSnapshot(doc(db, 'tournaments', tournamentId), (snap) => {
      if (snap.exists()) {
        setTournament({ id: snap.id, ...snap.data() } as Tournament)
      } else {
        navigate('/dashboard')
      }
      setLoading(false)
    })
    return unsub
  }, [tournamentId, navigate])

  const updateMatches = async (newMatches: Match[]) => {
    if (!tournamentId) return
    setSaving(true)
    try {
      await updateDoc(doc(db, 'tournaments', tournamentId), {
        matches: newMatches,
      })
    } catch (err) {
      console.error('Error updating matches:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleAdvanceWinner = (matchId: string, winner: string) => {
    if (!tournament) return
    const updated = advanceWinner(tournament.matches, matchId, winner)
    updateMatches(updated)
  }

  const handleScoreChange = (matchId: string, field: 'score1' | 'score2', value: number) => {
    if (!tournament) return
    const updated = tournament.matches.map((m: Match) =>
      m.matchId === matchId ? { ...m, [field]: value } : m
    )
    updateMatches(updated)
  }

  const handleTeamChange = (matchId: string, field: 'team1' | 'team2', value: string) => {
    if (!tournament) return
    const updated = tournament.matches.map((m: Match) =>
      m.matchId === matchId ? { ...m, [field]: value } : m
    )
    updateMatches(updated)
  }

  const updateStatus = async (status: TournamentStatus) => {
    if (!tournamentId) return
    await updateDoc(doc(db, 'tournaments', tournamentId), { status })
  }

  const copyLink = () => {
    const url = `${window.location.origin}/bracket/${tournamentId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#08080F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!tournament) return null

  return (
    <div className="min-h-[100dvh] bg-[#08080F] flex flex-col">
      {/* Admin Toolbar */}
      <div className="bg-[#13131F]/80 backdrop-blur-md border-b border-[#1F1F30] sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#13131F] border border-[#1F1F30] text-[#8B8FA8] hover:text-white hover:border-[#A855F7] transition-all duration-300 group"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-[#A855F7]" />
                  <span className="text-sm font-bold text-white">Copied!</span>
                </>
              ) : (
                <>
                  <Link2 size={16} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-sm font-bold">Share Bracket</span>
                </>
              )}
            </button>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#13131F] border border-[#1F1F30] text-[#8B8FA8] hover:text-white transition-all duration-300"
            >
              <LayoutDashboard size={16} />
              <span className="text-sm font-bold">Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-[#1F1F30] hidden sm:block" />
            <div className="hidden sm:block">
              <h1 className="text-white font-bold truncate max-w-[200px]">{tournament.name}</h1>
              <p className="text-[#8B8FA8] text-[10px] uppercase tracking-wider">
                {getSportEmoji(tournament.sport)} Admin Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={tournament.status}
              onChange={(e) => updateStatus(e.target.value as TournamentStatus)}
              className={`text-xs font-bold px-3 py-2 rounded-lg outline-none cursor-pointer border transition-all duration-300 ${
                tournament.status === 'live'
                  ? 'bg-[#A855F7] border-[#A855F7] text-white'
                  : 'bg-[#1E1E30] border-[#2A2A40] text-[#8B8FA8]'
              }`}
            >
              <option value="upcoming">Upcoming</option>
              <option value="live">Live Now</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-[#13131F] border border-[#1F1F30] hover:border-[#A855F7] text-white px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 group"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="group-hover:text-[#A855F7]" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Bracket Area */}
      <div className="flex-1 overflow-auto p-8 sm:p-12 relative">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#A855F7]/5 blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 text-center sm:text-left">
             <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
               <span className="text-4xl">{getSportEmoji(tournament.sport)}</span>
               <div>
                 <h2 className="text-3xl font-bold text-white mb-1">{tournament.name}</h2>
                 <p className="text-[#8B8FA8]">
                   {tournament.teamCount} Teams · Single Elimination
                 </p>
               </div>
             </div>
             <p className="text-[#8B8FA8]/60 text-sm max-w-lg mx-auto sm:mx-0">
               Click team names to edit. Enter scores to track progress. Click "Win" buttons to advance teams to the next round. All changes are saved instantly.
             </p>
          </div>

          <BracketView
            matches={tournament.matches}
            teamCount={tournament.teamCount}
            editable={true}
            onAdvanceWinner={handleAdvanceWinner}
            onScoreChange={handleScoreChange}
            onTeamChange={handleTeamChange}
          />
        </div>
      </div>

      {/* Saving Indicator */}
      <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-[#13131F] border border-[#1F1F30] rounded-full text-xs transition-opacity duration-300 ${saving ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
        <span className="text-[#8B8FA8]">Saving changes...</span>
      </div>
    </div>
  )
}
