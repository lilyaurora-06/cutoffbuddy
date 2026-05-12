import { BookOpen, FileText, MousePointer, BarChart2, CreditCard, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    title: 'Document Verification (DV)',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    content: [
      'KCET 2025 admit card + score card',
      'SSLC / 10th marks card',
      'PUC / 12th marks card (original)',
      'Income certificate (if applying for reservation)',
      'Caste / category certificate (SC/ST/OBC)',
      'Karnataka domicile certificate',
      'Passport-size photos (10 copies)',
      'Aadhaar card of student and parent',
    ],
    note: 'DV is mandatory. Without it, you cannot participate in option entry.',
  },
  {
    icon: MousePointer,
    title: 'Option Entry (College Choice Filling)',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    content: [
      'Login to KEA portal with your KCET application number',
      'Browse colleges and branches using your category',
      'Add college-branch combinations in order of preference',
      'Put your most preferred choice as Option 1',
      'You can fill up to 500+ options — fill as many as possible',
      'Save your choices and note them down',
      'Edit anytime before the deadline',
      'Lock/submit before the deadline — no changes after',
    ],
    note: 'Tip: Fill ALL colleges you would accept. More options = better chance.',
  },
  {
    icon: BarChart2,
    title: 'Mock Allotment',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    content: [
      'KEA releases a mock allotment before actual allotment',
      'Check if you got a seat based on your current options',
      'If you\'re not happy, rearrange your option order',
      'Mock allotment is not final — it\'s just for practice',
      'Use it to decide if you need to add more options',
      'Edit options after mock, before final deadline',
    ],
    note: 'Always recheck your options after seeing the mock result.',
  },
  {
    icon: BarChart2,
    title: 'Allotment Rounds',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    content: [
      'Round 1: First allotment. Check your seat.',
      'If satisfied → Freeze your seat and pay fees',
      'If not satisfied → Float (keep seat + participate in R2)',
      'Slide → Upgrade within same college/category (auto upgrade)',
      'Round 2: If better seat available, you\'ll be allotted',
      'Extended Round: For remaining seats after R1+R2',
      'Special Round: Only for very specific seats if any remain',
    ],
    note: 'Freeze = final decision. Float = still looking for better option.',
  },
  {
    icon: CreditCard,
    title: 'Fee Payment & Reporting',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    content: [
      'Pay the tuition fee online through KEA portal',
      'Fee varies: Government (≈₹50K/yr), Aided (≈₹35K), Private (₹90K–₹1.85L)',
      'Download the allotment letter from KEA portal',
      'Report to the allotted college within the deadline',
      'Carry all original documents + photocopies',
      'College will verify documents and confirm admission',
    ],
    note: 'Missing the reporting deadline = seat cancellation, no refund.',
  },
]

const mistakes = [
  'Not filling enough options (fill 100+ at minimum)',
  'Putting dream college first when rank is borderline',
  'Not attending DV — makes you ineligible',
  'Missing fee payment deadline after allotment',
  'Not bringing originals to document verification',
  'Ignoring Extended/Special rounds — good seats remain',
  'Choosing Float without understanding the risk of losing seat',
  'Not checking the KEA portal regularly for updates',
]

const faqs = [
  {
    q: 'Can I change options after Round 1 allotment?',
    a: 'No. Options lock before Round 1. You can only choose Freeze / Float / Slide after allotment.',
  },
  {
    q: 'What is Float vs Freeze vs Slide?',
    a: 'Freeze = accept this seat, stop. Float = keep this seat but try for better in Round 2. Slide = auto-upgrade within same college if a better branch opens up.',
  },
  {
    q: 'If I Float in Round 2 and get a better seat, do I lose the old one?',
    a: 'Yes. Once you get a new allotment in Round 2, your Round 1 seat is released. You must accept the new one.',
  },
  {
    q: 'Which category should I select — GM or reserved?',
    a: 'Always select your actual reservation category. KEA automatically allots in the best category (GM or reserved) that benefits you. You never lose by selecting your category.',
  },
  {
    q: 'Is CutoffBuddy rank predictor 100% accurate?',
    a: 'No. It\'s an estimate based on KEA\'s official formula and historical data. Actual rank depends on this year\'s total candidates and distribution. Use it as a guide.',
  },
]

export default function CounsellingGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-amber-600 mb-2">
          <BookOpen className="w-5 h-5" />
          <span className="text-sm font-medium">Counselling Guide</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">KCET Counselling — Step by Step</h1>
        <p className="text-slate-500 mt-1.5">Everything you need to know about the KEA allotment process</p>
      </div>

      {/* Steps */}
      <div className="space-y-5 mb-12">
        {steps.map(({ icon: Icon, title, color, bg, border, content, note }, idx) => (
          <div key={idx} className={`bg-white rounded-2xl border ${border} shadow-sm overflow-hidden`}>
            <div className={`${bg} px-6 py-4 flex items-center gap-3`}>
              <div className={`${bg} border ${border} rounded-xl p-2.5`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <span className={`text-xs font-medium ${color} opacity-70`}>Step {idx + 1}</span>
                <h2 className="font-semibold text-slate-800">{title}</h2>
              </div>
            </div>
            <div className="px-6 py-5">
              <ul className="space-y-2">
                {content.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <ChevronRight className={`w-4 h-4 ${color} mt-0.5 shrink-0`} />
                    {item}
                  </li>
                ))}
              </ul>
              {note && (
                <div className="mt-4 flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <CheckCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600">{note}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Common Mistakes */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Common Mistakes to Avoid
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <ul className="space-y-3">
            {mistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-red-800">
                <span className="w-5 h-5 bg-red-200 text-red-700 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="font-semibold text-slate-800 text-sm mb-2">Q: {q}</p>
              <p className="text-slate-600 text-sm leading-relaxed">A: {a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official links */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3">Official KEA Resources</h3>
        <ul className="space-y-2 text-sm">
          {[
            ['KEA Official Website', 'https://cetonline.karnataka.gov.in'],
            ['KCET 2025 Information Bulletin', 'https://cetonline.karnataka.gov.in'],
            ['KEA Helpline', 'tel:08048632060'],
          ].map(([label, href]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer"
                className="text-blue-700 hover:underline font-medium">{label} →</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
