'use client'
import { useState, useEffect, useMemo } from 'react'
import { Search, Info, Filter, AlertCircle } from 'lucide-react'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { predictColleges } from '@/lib/filter-utils'
import { CATEGORIES } from '@/lib/constants'
import type { CutoffRecord, CollegePrediction } from '@/types'

export default function CollegePredictorPage() {
  const [data, setData] = useState<CutoffRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [rank, setRank] = useState('')
  const [category, setCategory] = useState('GM')
  const [branchFilter, setBranchFilter] = useState('')
  const [results, setResults] = useState<CollegePrediction[]>([])
  const [dataInfo, setDataInfo] = useState<{ year: number; round: string; usedCategory: string } | null>(null)
  const [searched, setSearched] = useState(false)
  const [rankError, setRankError] = useState('')

  useEffect(() => {
    setDataLoading(true)
    // Load all years for best coverage
    Promise.all([
      fetch('/data/cutoffs_2025.json').then(r => r.json()),
      fetch('/data/cutoffs_2024.json').then(r => r.json()),
    ]).then(([d25, d24]) => {
      setData([...d25, ...d24])
      setDataLoading(false)
    }).catch(() => {
      fetch('/data/cutoffs_latest.json').then(r => r.json()).then(d => {
        setData(d)
        setDataLoading(false)
      })
    })
  }, [])

  const branches = useMemo(() => {
    const map = new Map<string, string>()
    data.forEach((r) => map.set(r.branch_code, r.branch_name))
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [data])

  function handleSearch() {
    const r = Number(rank)
    if (!rank || isNaN(r) || r < 1) { setRankError('Enter a valid rank (e.g. 5000)'); return }
    if (r > 300000) { setRankError('Rank seems too high. Max ~300,000'); return }
    setRankError('')
    setLoading(true)
    setTimeout(() => {
      const { predictions, dataYear, dataRound, usedCategory } = predictColleges(
        data, r, category, branchFilter || undefined
      )
      setResults(predictions)
      setDataInfo({ year: dataYear, round: dataRound, usedCategory })
      setSearched(true)
      setLoading(false)
    }, 400)
  }

  const safe = results.filter(r => r.probability === 'Safe')
  const moderate = results.filter(r => r.probability === 'Moderate')
  const ambitious = results.filter(r => r.probability === 'Ambitious')

  const probConfig = {
    Safe: { variant: 'safe' as const, desc: 'Your rank is ≥20% better than cutoff' },
    Moderate: { variant: 'moderate' as const, desc: 'Your rank is within cutoff range' },
    Ambitious: { variant: 'ambitious' as const, desc: 'Rank is up to 20% above cutoff — possible but risky' },
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-violet-600 mb-2">
          <Search className="w-5 h-5" />
          <span className="text-sm font-medium">College Predictor</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Find Colleges for Your Rank</h1>
        <p className="text-slate-500 mt-1.5">Uses best available cutoff data — 2025 Round 3 preferred, earlier rounds as fallback</p>
      </div>

      {/* Search form */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Your Rank"
              type="number"
              placeholder="e.g. 8500"
              value={rank}
              onChange={(e) => { setRank(e.target.value); setRankError('') }}
              error={rankError}
              hint="Enter your KCET 2026 rank"
            />
            <Select
              label="Your Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={CATEGORIES}
            />
            <Select
              label="Branch (optional)"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              placeholder="All Branches"
              options={branches.map(([code, name]) => ({ value: code, label: name }))}
            />
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                loading={loading || dataLoading}
                className="w-full"
                size="lg"
              >
                {dataLoading ? 'Loading data…' : 'Find Colleges'}
              </Button>
            </div>
          </div>

          {/* How probability works */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.entries(probConfig).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <Badge variant={val.variant}>{key}</Badge>
                <span className="text-xs text-slate-500">{val.desc}</span>
              </div>
            ))}
          </div>

          {/* Data source info */}
          {dataInfo && (
            <div className="mt-3 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-xs text-blue-700">
                Using <span className="font-semibold">{dataInfo.year} {dataInfo.round}</span> cutoffs
                for category <span className="font-semibold">{dataInfo.usedCategory}</span>
                {dataInfo.usedCategory !== category && (
                  <span className="text-amber-600"> (no {category} data — showing GM cutoffs as reference)</span>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary row */}
      {searched && results.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-5 items-center">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm">
            <span className="font-bold text-green-700">{safe.length}</span> <span className="text-green-600">Safe</span>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-sm">
            <span className="font-bold text-yellow-700">{moderate.length}</span> <span className="text-yellow-600">Moderate</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm">
            <span className="font-bold text-red-700">{ambitious.length}</span> <span className="text-red-600">Ambitious</span>
          </div>
          <span className="text-sm text-slate-500">{results.length} total options found</span>
        </div>
      )}

      {/* No results */}
      {searched && results.length === 0 && !loading && (
        <Card>
          <CardContent className="py-16 text-center">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No colleges found for rank {Number(rank).toLocaleString('en-IN')} in {category}</p>
            <p className="text-slate-400 text-sm mt-1">Try a different category or remove the branch filter</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {searched && results.length > 0 && (
        <div className="space-y-2 animate-fade-in">
          {results.map((col, i) => {
            const cfg = probConfig[col.probability]
            const rankDiff = Number(rank) - col.closing_rank
            const pct = Math.round(Math.abs(rankDiff / col.closing_rank) * 100)
            return (
              <div key={`${col.college_code}-${col.branch_code}-${i}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {col.college_code}
                      </span>
                      <Badge variant={cfg.variant}>{col.probability}</Badge>
                      <span className="text-xs text-slate-400">
                        {rankDiff < 0
                          ? `${pct}% below cutoff ✓`
                          : `${pct}% above cutoff`}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm leading-snug">{col.college_name}</h3>
                    <p className="text-blue-600 text-sm mt-0.5">{col.branch_name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-slate-400 mb-0.5">{col.year} {col.round}</div>
                    <div className="font-bold text-slate-800 text-lg">{col.closing_rank.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-slate-400">Closing Rank</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!searched && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Enter your rank, category and click <span className="font-medium text-slate-500">Find Colleges</span></p>
            <p className="text-slate-300 text-xs mt-1">Uses 2025 actual cutoff data as reference</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
