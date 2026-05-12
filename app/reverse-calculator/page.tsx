'use client'
import { useState, useEffect, useMemo } from 'react'
import { Calculator, ArrowRight, Info } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CATEGORIES, SCORE_TO_RANK } from '@/lib/constants'
import type { CutoffRecord } from '@/types'

export default function ReverseCalculatorPage() {
  const [data, setData] = useState<CutoffRecord[]>([])
  const [college, setCollege] = useState('')
  const [branch, setBranch] = useState('')
  const [category, setCategory] = useState('GM')
  const [result, setResult] = useState<{ rank: number; cetScore: number; boardScore: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/cutoffs_latest.json').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  const colleges = useMemo(() => {
    const map = new Map<string, string>()
    data.forEach(r => map.set(r.college_code, r.college_name))
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [data])

  const branches = useMemo(() => {
    if (!college) return []
    const map = new Map<string, string>()
    data.filter(r => r.college_code === college).forEach(r => map.set(r.branch_code, r.branch_name))
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [data, college])

  function calculate() {
    if (!college || !branch) return
    const rec = data.find(r => r.college_code === college && r.branch_code === branch && r.category === category)
    if (!rec) return

    const targetRank = rec.closing_rank
    // Reverse lookup: what composite score gives this rank?
    let compositeScore = 40
    for (const [score, low, high] of SCORE_TO_RANK) {
      if (targetRank >= low && targetRank <= high) { compositeScore = score; break }
    }
    // What KCET score + board score gives this composite?
    // composite = (cetPercent + boardPercent) / 2
    // Assuming board = 75% → cetPercent = composite*2 - 75
    const boardPercent = 75
    const cetPercent = Math.max(0, compositeScore * 2 - boardPercent)
    const cetScore = Math.round((cetPercent / 100) * 180)
    const boardScore = Math.round((boardPercent / 100) * 300)

    setResult({ rank: targetRank, cetScore, boardScore })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-600 mb-2">
          <Calculator className="w-5 h-5" />
          <span className="text-sm font-medium">Reverse Calculator</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">What Score Do I Need?</h1>
        <p className="text-slate-500 mt-1.5">Pick a target college & branch — we'll tell you what rank and score you need</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6 space-y-4">
          <Select label="Target College" value={college} onChange={e => { setCollege(e.target.value); setBranch(''); setResult(null) }}
            placeholder={loading ? 'Loading…' : 'Select college…'}
            options={colleges.map(([code, name]) => ({ value: code, label: `${code} – ${name.slice(0, 45)}` }))} />
          <Select label="Target Branch" value={branch} onChange={e => { setBranch(e.target.value); setResult(null) }}
            placeholder="Select branch…" disabled={!college}
            options={branches.map(([code, name]) => ({ value: code, label: name }))} />
          <Select label="Your Category" value={category} onChange={e => { setCategory(e.target.value); setResult(null) }} options={CATEGORIES} />
          <Button onClick={calculate} disabled={!college || !branch} size="lg" className="w-full">
            Calculate Required Score <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-blue-200 animate-slide-up">
          <CardHeader>
            <h2 className="font-semibold text-slate-800">To get into {college} – {branch} ({category})</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="text-center bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Need Rank Below</p>
                <p className="text-2xl font-extrabold text-blue-700">{result.rank.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-center bg-green-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">KCET Score ~</p>
                <p className="text-2xl font-extrabold text-green-700">{result.cetScore}<span className="text-sm font-normal text-slate-500">/180</span></p>
              </div>
              <div className="text-center bg-violet-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Board PCM ~</p>
                <p className="text-2xl font-extrabold text-violet-700">{result.boardScore}<span className="text-sm font-normal text-slate-500">/300</span></p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 space-y-1.5">
              <p>📌 Based on <span className="font-semibold">2025 Round 3</span> closing rank for {category} category</p>
              <p>📌 Board score estimate assumes <span className="font-semibold">75% board marks</span> — adjust for your actual board performance</p>
              <p>📌 Cutoffs change every year — use this as a benchmark, not a guarantee</p>
            </div>

            <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">This is useful for KCET 2026 aspirants to set a target score.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
