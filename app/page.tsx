import Link from 'next/link'
import { ArrowRight, BarChart2, BookOpen, Search, TrendingUp, CheckCircle, Users, Database } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Rank Predictor',
    desc: 'Enter your KCET & board marks. Get an estimated rank range instantly using KEA\'s official formula.',
    href: '/rank-predictor',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Search,
    title: 'College Predictor',
    desc: 'Enter your rank & category. See which colleges and branches are Safe, Moderate, or Ambitious.',
    href: '/college-predictor',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: BarChart2,
    title: 'Cutoff Explorer',
    desc: 'Browse real cutoffs for 256+ colleges across all categories, rounds, and years (2023–2025).',
    href: '/cutoffs',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: BookOpen,
    title: 'Counselling Guide',
    desc: 'Step-by-step guide to KCET counselling — documents, option entry, rounds, and common mistakes.',
    href: '/counselling-guide',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

const stats = [
  { icon: Database, value: '81,000+', label: 'Cutoff Records' },
  { icon: Users, value: '256', label: 'Colleges Covered' },
  { icon: BarChart2, value: '3 Years', label: '2023 · 2024 · 2025' },
  { icon: CheckCircle, value: 'All Rounds', label: 'R1 · R2 · R3 · Extended' },
]

const steps = [
  { num: '1', title: 'Enter Your Marks', desc: 'Physics, Chemistry, Maths in KCET + your board PCM marks' },
  { num: '2', title: 'Get Your Rank Range', desc: 'We estimate your rank using KEA\'s official merit formula' },
  { num: '3', title: 'Find Your Colleges', desc: 'See Safe, Moderate & Ambitious options based on real cutoffs' },
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
            Updated with 2025 cutoff data
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight text-balance">
            Your KCET Counselling<br />
            <span className="text-blue-200">Made Simple</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8 text-balance">
            Predict your rank, find colleges, and explore real cutoffs for 256+ Karnataka engineering colleges — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/rank-predictor"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Predict My Rank <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/college-predictor"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Find Colleges
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
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Everything You Need for Counselling</h2>
          <p className="text-slate-500 mt-2">Four tools. Real data. Zero confusion.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, title, desc, href, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200"
            >
              <div className={`inline-flex p-3 rounded-xl ${bg} mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="font-semibold text-slate-800 text-lg mb-1.5 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${color}`}>
                Get started <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-800 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
            <p className="text-slate-400 mt-2">3 steps to your college list</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                  {num}
                </div>
                <h3 className="font-semibold text-lg mb-1.5">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">⚠️ Disclaimer:</span> Rank predictions are estimates based on KEA's merit formula and historical data. Actual ranks may vary. Always verify at{' '}
            <a href="https://cetonline.karnataka.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-medium">cetonline.karnataka.gov.in</a>.
          </p>
        </div>
      </section>
    </div>
  )
}
