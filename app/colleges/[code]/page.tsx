'use client'
import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe, MapPin, Award, BookOpen, TrendingUp, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { CutoffRecord } from '@/types'

interface CollegeDetail {
  code: string
  name: string
  city: string
  type: string
  lat: number
  lng: number
  website: string | null
  nirf_rank: number | null
  affiliation: string
}

const BRANCH_COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#84cc16']

export default function CollegeDetailPage() {
  const params = useParams()
  const code = (params.code as string).toUpperCase()

  const [detail, setDetail] = useState<CollegeDetail | null>(null)
  const [cutoffs, setCutoffs] = useState<CutoffRecord[]>([])
  const [category, setCategory] = useState('GM')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/data/college_details.json').then(r => r.json()),
      fetch('/data/cutoffs_2023.json').then(r => r.json()),
      fetch('/data/cutoffs_2024.json').then(r => r.json()),
      fetch('/data/cutoffs_2025.json').then(r => r.json()),
    ]).then(([details, d23, d24, d25]) => {
      const d = details.find((c: CollegeDetail) => c.code === code)
      setDetail(d || null)
      const all: CutoffRecord[] = [...d23, ...d24, ...d25]
      setCutoffs(all.filter(r => r.college_code === code))
      setLoading(false)
    })
  }, [code])

  // Build trend data per branch
  const trendData = useMemo(() => {
    const branches = Array.from(new Set(cutoffs.filter(r => r.category === category).map(r => r.branch_code)))
    const years = [2023, 2024, 2025]
    return years.map(year => {
      const point: Record<string, unknown> = { year }
      for (const bc of branches) {
        const rec = cutoffs.find(r => r.year === year && r.category === category && r.branch_code === bc && r.round === 'Round 1')
        if (rec) point[bc] = rec.closing_rank
      }
      return point
    })
  }, [cutoffs, category])

  const branches = useMemo(() =>
    [...new Map(cutoffs.filter(r => r.category === category).map(r => [r.branch_code, r.branch_name])).entries()],
  [cutoffs, category])

  const categories = useMemo(() => [...new Set(cutoffs.map(r => r.category))].sort(), [cutoffs])

  const latest2025 = useMemo(() =>
    cutoffs.filter(r => r.year === 2025 && r.round === 'Round 3' && r.category === category)
      .sort((a, b) => a.closing_rank - b.closing_rank),
  [cutoffs, category])

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400">Loading college data…</div>
  )
  if (!detail) return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400">College not found</div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link href="/cutoffs" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cutoffs
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs font-mono px-2 py-0.5 rounded">{detail.code}</span>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded">{detail.type}</span>
              {detail.nirf_rank && (
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded">
                  NIRF #{detail.nirf_rank}
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-1">{detail.name}</h1>
            <div className="flex items-center gap-4 text-blue-100 text-sm flex-wrap">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{detail.city}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{detail.affiliation}</span>
            </div>
          </div>
          {detail.website && (
            <a href={detail.website} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors shrink-0">
              <Globe className="w-4 h-4" /> Visit Website <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-sm font-medium text-slate-600">Category:</span>
        {categories.slice(0, 12).map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              category === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}>{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — trend chart + latest cutoffs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Cutoff Trend 2023–2025 (Round 1, {category})
              </h2>
            </CardHeader>
            <CardContent>
              {trendData.some(d => Object.keys(d).length > 1) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis reversed tick={{ fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                    <Tooltip formatter={(v: number) => v?.toLocaleString('en-IN')} />
                    <Legend />
                    {branches.slice(0, 6).map(([bc, bn], i) => (
                      <Line key={bc} type="monotone" dataKey={bc} name={bn.slice(0, 20)}
                        stroke={BRANCH_COLORS[i % BRANCH_COLORS.length]} strokeWidth={2}
                        dot={{ r: 4 }} connectNulls />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
                  No trend data for {category} category
                </div>
              )}
            </CardContent>
          </Card>

          {/* Latest cutoffs table */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-800">2025 Round 3 Cutoffs — {category}</h2>
            </CardHeader>
            <CardContent>
              {latest2025.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-2 font-medium text-slate-500">Branch</th>
                        <th className="text-right py-2 font-medium text-slate-500">Closing Rank</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {latest2025.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 text-slate-700">{r.branch_name}</td>
                          <td className="py-2.5 text-right font-bold text-slate-800">
                            {r.closing_rank.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-400 text-sm text-center py-6">No 2025 data for {category} category</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right — info cards */}
        <div className="space-y-4">
          {/* College info */}
          <Card>
            <CardContent className="pt-5 space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">College Code</p>
                <p className="font-mono font-bold text-slate-800">{detail.code}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Location</p>
                <p className="font-medium text-slate-800">{detail.city}, Karnataka</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Type</p>
                <p className="font-medium text-slate-800">{detail.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Affiliation</p>
                <p className="font-medium text-slate-800">{detail.affiliation}</p>
              </div>
              {detail.nirf_rank && (
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">NIRF 2024 Rank</p>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <p className="font-bold text-slate-800">#{detail.nirf_rank}</p>
                  </div>
                </div>
              )}
              {detail.website && (
                <a href={detail.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium pt-1">
                  <Globe className="w-4 h-4" />
                  Official Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="pt-5 space-y-2.5">
              <h3 className="font-semibold text-blue-800 text-sm mb-3">Quick Actions</h3>
              <Link href={`/college-predictor`}
                className="block w-full text-center bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                Check My Chances
              </Link>
              <Link href={`/cutoffs?college=${detail.code}`}
                className="block w-full text-center bg-white text-blue-700 border border-blue-200 text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                All Cutoffs for This College
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
