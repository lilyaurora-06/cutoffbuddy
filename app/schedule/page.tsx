import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const schedule2025 = [
  { phase: 'KCET Exam', date: 'April 23–24, 2025', status: 'done', desc: 'Physics, Chemistry, Maths papers' },
  { phase: 'KCET Results', date: 'May 15, 2025', status: 'done', desc: 'Results declared on KEA portal' },
  { phase: 'Document Verification', date: 'June 10–20, 2025', status: 'done', desc: 'Mandatory at designated DV centres' },
  { phase: 'Registration & Fee', date: 'June 15–25, 2025', status: 'done', desc: 'Pay counselling fee on KEA portal' },
  { phase: 'Option Entry (Choice Filling)', date: 'June 20 – July 5, 2025', status: 'done', desc: 'Fill college-branch preferences online' },
  { phase: 'Mock Allotment', date: 'July 8–10, 2025', status: 'done', desc: 'Preview of allotment — edit options based on result' },
  { phase: 'Final Option Lock', date: 'July 12, 2025', status: 'done', desc: 'Options locked — no changes after this' },
  { phase: 'Round 1 Allotment', date: 'August 2, 2025', status: 'done', desc: 'First seat allotment released' },
  { phase: 'Round 1 Reporting', date: 'August 3–8, 2025', status: 'done', desc: 'Pay fee + report to college or choose Float' },
  { phase: 'Round 2 Option Entry', date: 'August 4–6, 2025', status: 'done', desc: 'For students who chose Float in Round 1' },
  { phase: 'Round 2 Allotment', date: 'August 12, 2025', status: 'done', desc: 'Second allotment released' },
  { phase: 'Round 2 Reporting', date: 'August 13–16, 2025', status: 'done', desc: 'Report to college or choose Extended Round' },
  { phase: 'Round 3 / Extended Round', date: 'September 2025', status: 'done', desc: 'For remaining seats after R1 & R2' },
  { phase: 'Special Round', date: 'October 2025', status: 'done', desc: 'For any remaining vacant seats' },
  { phase: 'KCET 2026 Exam', date: 'April 2026 (Expected)', status: 'upcoming', desc: 'Next year cycle begins' },
]

const tips = [
  { icon: '📅', tip: 'Set reminders 2 days before each deadline — KEA rarely extends dates' },
  { icon: '📄', tip: 'Get all documents verified even before DV dates are announced' },
  { icon: '🔐', tip: 'Note your KEA Application Number and password safely — you\'ll need it 10+ times' },
  { icon: '💳', tip: 'Keep your payment method ready — UPI, net banking, or debit card' },
  { icon: '🔄', tip: 'Check KEA portal daily during counselling — updates happen without notice' },
  { icon: '📱', tip: 'Join KEA official WhatsApp groups or Telegram channels for instant updates' },
]

export default function SchedulePage() {
  const statusConfig = {
    done: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200', label: 'Completed' },
    current: { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Ongoing' },
    upcoming: { icon: Clock, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200', label: 'Upcoming' },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-medium">Counselling Schedule</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">KCET 2025 Counselling Timeline</h1>
        <p className="text-slate-500 mt-1.5">All important dates in one place — bookmark this page</p>
      </div>

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm">Important Notice</p>
          <p className="text-amber-700 text-sm mt-0.5">
            Dates shown are from KCET 2025. Exact dates for 2026 will be announced by KEA.
            Always verify at <a href="https://cetonline.karnataka.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-medium">cetonline.karnataka.gov.in</a>
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mb-12">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
        <div className="space-y-4">
          {schedule2025.map((item, idx) => {
            const cfg = statusConfig[item.status as keyof typeof statusConfig]
            const Icon = cfg.icon
            return (
              <div key={idx} className="relative flex items-start gap-4 pl-14">
                <div className={`absolute left-3.5 w-5 h-5 rounded-full border-2 ${cfg.border} ${cfg.bg} flex items-center justify-center`}>
                  <Icon className={`w-3 h-3 ${cfg.color}`} />
                </div>
                <div className={`flex-1 border ${cfg.border} ${cfg.bg} rounded-2xl p-4`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">{item.phase}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                        {item.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tips */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">💡 Tips to Never Miss a Deadline</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tips.map((t, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <span className="text-2xl">{t.icon}</span>
              <p className="text-sm text-slate-700 leading-relaxed">{t.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
