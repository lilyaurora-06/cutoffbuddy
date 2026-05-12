'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react'

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/rank-predictor', label: 'Rank Predictor' },
  { href: '/college-predictor', label: 'College Predictor' },
  { href: '/cutoffs', label: 'Cutoffs' },
  { href: '/counselling-guide', label: 'Guide' },
]

const moreLinks = [
  { href: '/smart-list', label: '✨ Smart College List' },
  { href: '/compare', label: '⚖️ Compare Colleges' },
  { href: '/map', label: '🗺️ College Map' },
  { href: '/reverse-calculator', label: '🎯 Score Calculator' },
  { href: '/schedule', label: '📅 Counselling Schedule' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 shrink-0">
            <GraduationCap className="w-7 h-7" />
            <span>CutoffBuddy</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {mainLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.href ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}>
                {l.label}
              </Link>
            ))}
            <div className="relative">
              <button onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                More <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                  {moreLinks.map(l => (
                    <Link key={l.href} href={l.href} onClick={() => setMoreOpen(false)}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        pathname === l.href ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                      }`}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 max-h-96 overflow-y-auto">
          {[...mainLinks, ...moreLinks].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
      {moreOpen && <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />}
    </nav>
  )
}
