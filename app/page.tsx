import Link from 'next/link'
import { ArrowRight, BarChart2, BookOpen, Search, TrendingUp, CheckCircle, Users, Database, GitCompare, MapPin, Sparkles, Calculator, Calendar } from 'lucide-react'

const features = [
  { icon: TrendingUp, title: 'Rank Predictor', desc: 'Enter KCET & board marks. Get estimated rank range using KEA\'s official formula.', href: '/rank-predictor', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Search, title: 'College Predictor', desc: 'Enter rank & category. See Safe, Moderate & Ambitious college options instantly.', href: '/college-predictor', color: 'text-violet-600', bg: 'bg-violet-50' },
  { icon: BarChart2, title: 'Cutoff Explorer', desc: 'Browse real cutoffs for 256+ colleges. All categories, all rounds, 2023–2025.', href: '/cutoffs', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: BookOpen, title: 'Counselling Guide', desc: 'Step-by-step KCET counselling guide — documents, option entry, rounds & mistakes.', href: '/counselling-guide', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Sparkles, title: 'Smart College List', desc: 'Get a personalised list based on your rank, category, city & college type preference.', href: '/smart-list', color: 'text-pink-600', bg: 'bg-pink-50' },
  { icon: GitCompare, title: 'Compare Colleges', desc: 'Compare up to 3 colleges side by side — cutoffs, branches, NIRF ranks.', href: '/compare', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { icon: MapPin, title: 'College Map', desc: 'Explore all 256 colleges plotted on a Karnataka map. Click to see details.', href: '/map', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: Calculator, title: 'Score Calculator', desc: 'Pick a target college & branch — we\'ll tell you exactly what score you need.', href: '/reverse-calculator', color: 'text-orange-600', bg: 'bg-orange-50' },
  { icon: Calendar, title: 'Counselling Schedule', desc: 'All KCET 2025 important dates in one timeline. Never miss a deadline.', href: '/schedule', color: 'text-rose-600', bg: 'bg-rose-50' },
]

const stats = [
  { icon: Database, value: '81,000+', label: 'Cutoff Records' },
  { icon: Users, value: '256', label: 'Colleges Covered' },
  { icon: BarChart2, value: '3 Years', label: '2023 · 2024 · 2025' },
  { icon: CheckCircle, value: 'All Rounds', label: 'R1 · R2 · R3 · Extended' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Updated with 2025 cutoff data · 9 tools inside
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight">
            Your KCET Counselling<br />
            <span className="text-blue-200">Made Simple</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Predict rank, find colleges, explore cutoffs, compare options — everything for KCET 2025 counselling in one free tool.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/rank-predictor"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
              Predict My Rank <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/smart-list"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
              ✨ Get My College List
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center">
              <Icon className="w-5 h-5 text-blue-500 mx-auto mb-1.5" />
              <div className="text-xl font-bold text-slate-800">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">9 Tools. All Free. Real Data.</h2>
          <p className="text-slate-500 mt-2">Everything a KCET student needs — in one place.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, href, color, bg }) => (
            <Link key={href} href={href}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200">
              <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${color}`}>
                Open <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-800 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Start with Your Rank</h2>
          <p className="text-slate-400 mb-6">Takes 30 seconds. No login required.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/rank-predictor"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Predict My Rank <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/cutoffs"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Browse Cutoffs
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">⚠️ Disclaimer:</span> Predictions are estimates based on KEA's formula and historical data. Always verify at{' '}
            <a href="https://cetonline.karnataka.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-medium">cetonline.karnataka.gov.in</a>
          </p>
        </div>
      </section>
    </div>
  )
}
