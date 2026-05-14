import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import type { Tournament, TournamentStatus } from '@/types/tournament'
import { getSportEmoji } from '@/lib/bracket'
import { Plus, LogOut, Trophy, Trash2, ExternalLink } from 'lucide-react'

function StatusBadge({ status }: { status: TournamentStatus }) {
  if (status === 'live') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#A855F7] text-white">
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot" />
      Live
    </span>
  )
  if (status === 'completed') return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-[#A855F7] text-white">
      Completed
    </span>
  )
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#1E1E30] text-[#8B8FA8]">
      Upcoming
    </span>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'tournaments'), where('adminUid', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Tournament))
      data.sort((a, b) => (b.createdAt as any)?.seconds - (a.createdAt as any)?.seconds)
      setTournaments(data)
      setLoading(false)
    })
    return unsub
  }, [user])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteDoc(doc(db, 'tournaments', deleteTarget))
    setDeleteTarget(null)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-[100dvh] bg-[#08080F] px-4 py-8 relative overflow-hidden">
      {/* Radial glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#A855F7]/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#9333EA]/5 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#A855F7] flex items-center justify-center">
              <Trophy size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">BracketDay</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#8B8FA8] text-sm hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#8B8FA8] hover:text-white text-sm transition-colors duration-300"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">My Tournaments</h1>
          <Link
            to="/create"
            className="flex items-center gap-2 bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all duration-300 active:scale-[0.98]"
          >
            <Plus size={16} />
            New Tournament
          </Link>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#1F1F30] rounded-2xl">
            <Trophy size={40} className="text-[#8B8FA8] mx-auto mb-4" />
            <p className="text-[#8B8FA8] text-lg font-medium mb-2">No tournaments yet</p>
            <p className="text-[#8B8FA8]/60 text-sm mb-6">Create your first tournament to get started</p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-[#A855F7] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 hover:bg-[#9333EA]"
            >
              <Plus size={16} />
              Create Tournament
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="bg-[#13131F] border border-[#1F1F30] rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-[#A855F7]/30 transition-all duration-300"
              >
                <span className="text-2xl">{getSportEmoji(t.sport)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white truncate">{t.name}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-[#8B8FA8] text-sm mt-0.5">
                    {t.teamCount} teams · {t.sport === 'other' ? t.customSport : t.sport}
                    {t.date && ` · ${new Date((t.date as any).seconds * 1000).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/manage/${t.id}`}
                    className="flex items-center gap-1.5 text-xs text-[#A855F7] hover:text-white bg-[#A855F7]/10 hover:bg-[#A855F7] px-3 py-1.5 rounded-lg transition-all duration-300 font-medium"
                  >
                    <ExternalLink size={12} />
                    Manage
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(t.id!)}
                    className="p-1.5 text-[#8B8FA8] hover:text-red-400 transition-colors duration-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#13131F] border border-[#1F1F30] rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-bold text-lg mb-2">Delete tournament?</h3>
            <p className="text-[#8B8FA8] text-sm mb-6">This action cannot be undone. All bracket data will be lost.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#1F1F30] text-[#8B8FA8] hover:text-white text-sm font-medium transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
