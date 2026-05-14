import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { SPORTS, generateMatches } from '@/lib/bracket'
import { ChevronLeft, Trophy } from 'lucide-react'

export default function CreateTournament() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    sport: 'basketball',
    customSport: '',
    date: '',
    teamCount: 8,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    try {
      const matches = generateMatches(formData.teamCount as 4 | 8 | 16)
      
      const docRef = await addDoc(collection(db, 'tournaments'), {
        name: formData.name,
        sport: formData.sport,
        customSport: formData.customSport,
        date: formData.date ? new Date(formData.date) : null,
        teamCount: formData.teamCount,
        format: 'single_elimination',
        status: 'upcoming',
        adminUid: user.uid,
        createdAt: serverTimestamp(),
        matches,
      })

      navigate(`/manage/${docRef.id}`)
    } catch (err) {
      console.error('Error creating tournament:', err)
      alert('Failed to create tournament. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#08080F] px-4 py-8 relative overflow-hidden">
      {/* Radial glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#A855F7]/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#9333EA]/5 blur-[100px]" />
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-[#8B8FA8] hover:text-white mb-8 transition-colors duration-300 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#A855F7] flex items-center justify-center">
            <Trophy size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Tournament</h1>
        </div>

        <div className="bg-[#13131F] border border-[#1F1F30] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#8B8FA8] font-medium">Tournament Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Summer Smash 2025"
                required
                className="bg-[#0D0D1A] border border-[#2A2A40] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#A855F7] transition-colors duration-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#8B8FA8] font-medium">Sport</label>
                <select
                  value={formData.sport}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                  className="bg-[#0D0D1A] border border-[#2A2A40] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#A855F7] transition-colors duration-300 appearance-none cursor-pointer"
                >
                  {SPORTS.map((s: { value: string, label: string, emoji: string }) => (
                    <option key={s.value} value={s.value} className="bg-[#13131F]">
                      {s.emoji} {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#8B8FA8] font-medium">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-[#0D0D1A] border border-[#2A2A40] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#A855F7] transition-colors duration-300 appearance-none"
                />
              </div>
            </div>

            {formData.sport === 'other' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#8B8FA8] font-medium">Custom Sport Name</label>
                <input
                  type="text"
                  value={formData.customSport}
                  onChange={(e) => setFormData({ ...formData, customSport: e.target.value })}
                  placeholder="Enter sport name"
                  required
                  className="bg-[#0D0D1A] border border-[#2A2A40] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#A855F7] transition-colors duration-300"
                />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <label className="text-sm text-[#8B8FA8] font-medium">Number of Teams</label>
              <div className="grid grid-cols-3 gap-3">
                {[4, 8, 16].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setFormData({ ...formData, teamCount: count })}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all duration-300 ${
                      formData.teamCount === count
                        ? 'bg-[#A855F7] border-[#A855F7] text-white'
                        : 'bg-[#0D0D1A] border-[#2A2A40] text-[#8B8FA8] hover:border-[#A855F7]/50'
                    }`}
                  >
                    {count} Teams
                  </button>
                ))}
              </div>
              <p className="text-[#8B8FA8] text-[11px] uppercase tracking-wider mt-1 text-center">
                Single Elimination Format
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-[#A855F7] hover:bg-[#9333EA] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-300 active:scale-[0.98] glow-violet"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Bracket...
                </span>
              ) : (
                'Create Tournament'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
