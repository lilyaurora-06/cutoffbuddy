import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-blue-600 mb-2">
              <GraduationCap className="w-6 h-6" />
              CutoffBuddy
            </div>
            <p className="text-sm text-slate-500">
              Free KCET counselling tools for Karnataka engineering students.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              {[
                ['/', 'Home'],
                ['/rank-predictor', 'Rank Predictor'],
                ['/college-predictor', 'College Predictor'],
                ['/cutoffs', 'Cutoff Explorer'],
                ['/counselling-guide', 'Counselling Guide'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-blue-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Disclaimer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              CutoffBuddy is an independent educational tool. Data is sourced from KEA official
              publications. Rank predictions are estimates only — not official KEA results. Always
              verify information at{' '}
              <a
                href="https://cetonline.karnataka.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                cetonline.karnataka.gov.in
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} CutoffBuddy · For educational purposes only · Not affiliated with KEA or Government of Karnataka
        </div>
      </div>
    </footer>
  )
}
