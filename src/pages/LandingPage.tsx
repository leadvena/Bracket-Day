import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Zap, Share2, Smartphone, Globe, Check, ArrowRight, Play, RefreshCcw } from 'lucide-react'
import type { Match } from '@/types/tournament'
import { advanceWinner } from '@/lib/bracket'
import BracketView from '@/components/BracketView'

export default function LandingPage() {
  // Demo Bracket State
  const [demoMatches, setDemoMatches] = useState<Match[]>([
    { matchId: 'm0', round: 1, position: 0, team1: 'Alpha', team2: 'Beta', score1: 12, score2: 10, winner: null, status: 'live' },
    { matchId: 'm1', round: 1, position: 1, team1: 'Gamma', team2: 'Delta', score1: 8, score2: 15, winner: null, status: 'pending' },
    { matchId: 'm2', round: 2, position: 0, team1: '', team2: '', score1: null, score2: null, winner: null, status: 'pending' },
  ])

  const handleDemoAdvance = (matchId: string, winner: string) => {
    const updated = advanceWinner(demoMatches, matchId, winner)
    setDemoMatches(updated)
  }

  const resetDemo = () => {
    setDemoMatches([
      { matchId: 'm0', round: 1, position: 0, team1: 'Alpha', team2: 'Beta', score1: 12, score2: 10, winner: null, status: 'live' },
      { matchId: 'm1', round: 1, position: 1, team1: 'Gamma', team2: 'Delta', score1: 8, score2: 15, winner: null, status: 'pending' },
      { matchId: 'm2', round: 2, position: 0, team1: '', team2: '', score1: null, score2: null, winner: null, status: 'pending' },
    ])
  }

  return (
    <div className="min-h-[100dvh] bg-[#08080F] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#08080F]/80 backdrop-blur-md border-b border-[#1F1F30]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#A855F7] flex items-center justify-center">
              <Trophy size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">BracketDay</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8B8FA8]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <Link
            to="/login"
            className="bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 active:scale-[0.98] glow-violet"
          >
            Create Free Tournament
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#A855F7]/10 blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#A855F7]/10 border border-[#A855F7]/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
             <Zap size={14} className="text-[#A855F7]" />
             <span className="text-[#A855F7] text-[10px] uppercase tracking-[0.2em] font-bold">The #1 Tournament Platform</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]">
            Run Your Tournament. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#9333EA]">Share It Instantly.</span>
          </h1>
          <p className="text-[#8B8FA8] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Create professional brackets for any sport in minutes. 
            Share a live link with everyone — no app download required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold px-10 py-5 rounded-2xl text-lg transition-all duration-300 active:scale-[0.98] glow-violet-lg flex items-center justify-center gap-2"
            >
              Create Free Tournament
              <ArrowRight size={20} />
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto border border-[#1F1F30] hover:border-[#A855F7]/50 text-white font-bold px-10 py-5 rounded-2xl text-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 bg-[#13131F]/50"
            >
              See Live Demo
              <Play size={20} className="fill-white" />
            </a>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-[#1F1F30] bg-[#13131F]/20">
         <p className="text-center text-[#8B8FA8] text-sm uppercase tracking-[0.2em] font-bold">
           Used for Basketball · Football · Volleyball · Badminton · Chess · Esports · and more
         </p>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-5xl font-bold mb-6">Start in Seconds.</h2>
             <p className="text-[#8B8FA8] max-w-xl mx-auto">Simple, powerful tournament management without the bloat.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Create', desc: 'Name your tournament, pick your sport, and add your teams.' },
              { step: '02', title: 'Manage', desc: 'Enter scores and advance winners with a single click.' },
              { step: '03', title: 'Share', desc: 'Copy your public link and share it anywhere instantly.' },
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="text-6xl font-bold text-[#A855F7]/10 mb-4 group-hover:text-[#A855F7]/20 transition-colors">{item.step}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-[#8B8FA8] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-32 px-6 bg-[#13131F]/30 border-y border-[#1F1F30]">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
              <span className="text-[#A855F7] text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Try It Right Now</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">No sign up. Just click.</h2>
              <p className="text-[#8B8FA8] mb-8">This is exactly what your viewers will see.</p>
              <button 
                onClick={resetDemo}
                className="text-[#8B8FA8] hover:text-white text-xs flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <RefreshCcw size={14} />
                Reset Demo
              </button>
           </div>

           <div className="bg-[#08080F] border border-[#1F1F30] rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative">
              {demoMatches[2].winner && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                  <div className="bg-[#A855F7] text-white px-6 py-2 rounded-full font-bold shadow-[0_0_20px_#A855F7]">
                     🎉 {demoMatches[2].winner} CROWNED CHAMPION!
                  </div>
                </div>
              )}
              <BracketView 
                matches={demoMatches}
                teamCount={4}
                editable={false}
                onAdvanceWinner={handleDemoAdvance}
              />
              
              {/* Force visible winner buttons for demo if TBD */}
              {!demoMatches[0].winner && (
                 <div className="absolute left-[calc(10%+132px)] top-[calc(50%-40px)] flex flex-col gap-2">
                    <button onClick={() => handleDemoAdvance('m0', 'Alpha')} className="bg-[#A855F7] text-[10px] font-bold px-2 py-1 rounded">Win</button>
                 </div>
              )}
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Trophy />, title: 'Any Sport', desc: 'Basketball to Chess, you name it.' },
              { icon: <Zap />, title: 'Real-Time Updates', desc: 'Scores update live for all viewers.' },
              { icon: <Share2 />, title: 'Instant Sharing', desc: 'One link, works on any device.' },
              { icon: <Smartphone />, title: 'No App Needed', desc: 'Runs in any browser instantly.' },
              { icon: <Check />, title: 'Free to Start', desc: 'No credit card required.' },
              { icon: <Globe />, title: 'Mobile Friendly', desc: 'Looks great on every phone.' },
            ].map((f, idx) => (
              <div key={idx} className="bg-[#13131F] border border-[#1F1F30] p-8 rounded-[2rem] hover:border-[#A855F7]/30 transition-all duration-300">
                <div className="text-[#A855F7] mb-6">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-[#8B8FA8] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 bg-[#08080F]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-5xl font-bold mb-6">Transparent Pricing.</h2>
             <p className="text-[#8B8FA8]">Pick the plan that fits your event.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Free */}
            <div className="bg-[#13131F] border border-[#1F1F30] p-10 rounded-[2.5rem] flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">FREE</h3>
                <div className="text-4xl font-bold">$0<span className="text-lg text-[#8B8FA8]">/month</span></div>
              </div>
              <ul className="flex-1 space-y-4 mb-10 text-[#8B8FA8] text-sm">
                <li className="flex items-center gap-3"><Check size={16} className="text-[#A855F7]" /> 1 active tournament</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-[#A855F7]" /> Up to 8 teams</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-[#A855F7]" /> Public share link</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-[#A855F7]" /> BracketDay branding</li>
              </ul>
              <Link to="/login" className="w-full py-4 rounded-xl border border-[#1F1F30] hover:border-[#A855F7] font-bold text-center transition-all">Get Started Free</Link>
            </div>

            {/* Pro */}
            <div className="bg-[#13131F] border-[#A855F7] border-2 p-10 rounded-[2.5rem] flex flex-col relative shadow-[0_0_40px_#A855F715]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#A855F7] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Most Popular</div>
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">PRO</h3>
                <div className="text-4xl font-bold">$9<span className="text-lg text-[#8B8FA8]">/month</span></div>
              </div>
              <ul className="flex-1 space-y-4 mb-10 text-[#8B8FA8] text-sm">
                <li className="flex items-center gap-3"><Check size={16} className="text-[#A855F7]" /> Unlimited tournaments</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-[#A855F7]" /> Up to 16 teams</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-[#A855F7]" /> Remove branding</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-[#A855F7]" /> Priority support</li>
              </ul>
              <Link to="/login" className="w-full py-4 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] font-bold text-center transition-all glow-violet">Start Pro</Link>
            </div>

            {/* Event */}
            <div className="bg-[#13131F] border border-[#1F1F30] p-10 rounded-[2.5rem] flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">EVENT</h3>
                <div className="text-4xl font-bold">$15<span className="text-lg text-[#8B8FA8]"> one-time</span></div>
              </div>
              <ul className="flex-1 space-y-4 mb-10 text-[#8B8FA8] text-sm">
                <li className="flex items-center gap-3"><Check size={16} className="text-[#A855F7]" /> Single tournament</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-[#A855F7]" /> Up to 16 teams</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-[#A855F7]" /> All Pro features included</li>
                <li className="flex items-center gap-3"><Check size={16} className="text-[#A855F7]" /> No subscription</li>
              </ul>
              <Link to="/login" className="w-full py-4 rounded-xl border border-[#1F1F30] hover:border-[#A855F7] font-bold text-center transition-all">Buy Event Pass</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-gradient-to-br from-[#A855F7] to-[#9333EA] p-12 md:p-24 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
           <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Your next tournament <br /> starts in 2 minutes.</h2>
              <Link
                to="/login"
                className="inline-flex bg-white text-[#A855F7] font-bold px-12 py-5 rounded-2xl text-xl hover:bg-gray-100 transition-all active:scale-[0.98] shadow-2xl"
              >
                Create Free Tournament
              </Link>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-[#1F1F30] bg-[#08080F]">
        <div className="max-w-7xl mx-auto text-center">
           <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#A855F7] flex items-center justify-center">
                <Trophy size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">BracketDay</span>
           </div>
           <p className="text-[#8B8FA8] mb-12">Run any tournament. Share it instantly.</p>
           <div className="flex justify-center gap-8 text-sm text-[#8B8FA8] mb-12">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Contact</a>
           </div>
           <p className="text-[#8B8FA8]/40 text-xs">© 2025 BracketDay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
