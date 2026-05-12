'use client'
import { useState, useEffect, useMemo } from 'react'
import { Search, Info, Filter } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
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
  const [searched, setSearched] = useState(false)
  const [rankError, setRankError] = useState('')

  useEffect(() => {
    setDataLoading(true)
    fetch('/data/cutoffs_latest.json')
      .then((r) => r.json())
      .then((d) => { setData(d); setDataLoading(false) })
      .catch(() => setDataLoading(false))
  }, [])

  const branches = useMemo(() => {
    const set = new Map<string, string>()
    data.forEach((r) => set.set(r.branch_code, r.branch_name))
    return Array.from(set.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [data])

  function handleSearch() {
    const r = Number(rank)
    if (!rank || isNaN(r) || r < 1) { setRankError('Enter a valid rank (e.g. 5000)'); return }
    if (r > 300000) { setRankError('Rank seems too high. Max is ~300000'); return }
    setRankError('')
    setLoading(true)
    setTimeout(() => {
      const res = predictColleges(data, r, category, branchFilter || undefined)
      setResults(res)
      setSearched(true)
      setLoading(false)
    }, 400)
  }

  const safe = results.filter((r) => r.probability === 'Safe')
  const moderate = results.filter((r) => r.probability === 'Moderate')
  const ambitious = results.filter((r) => r.probability === 'Ambitious')

  const probConfig = {
    Safe: { variant: 'safe' as const, label: 'Safe', desc: 'Your rank is well within cutoff' },
    Moderate: { variant: 'moderate' as const, label: 'Moderate', desc: 'Your rank is near cutoff' },
    Ambitious: { variant: 'ambitious' as const, label: 'Ambitious', desc: 'Slightly above last cutoff' },
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
        <p className="text-slate-500 mt-1.5">Based on 2025 KCET cutoff data (Round 3)</p>
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
            />
            <Select
              label="Category"
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

          <div className="mt-4 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700">
              Predictions use 2025 Round 3 cutoffs. Probability is based on your rank vs last year's closing rank.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary row */}
      {searched && results.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm">
            <span className="font-bold text-green-700">{safe.length}</span> <span className="text-green-600">Safe</span>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-sm">
            <span className="font-bold text-yellow-700">{moderate.length}</span> <span className="text-yellow-600">Moderate</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm">
            <span className="font-bold text-red-700">{ambitious.length}</span> <span className="text-red-600">Ambitious</span>
          </div>
          <div className="text-sm text-slate-500 flex items-center">{results.length} colleges found</div>
        </div>
      )}

      {/* Results */}
      {searched && results.length === 0 && !loading && (
        <Card>
          <CardContent className="py-16 text-center">
            <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No colleges found for this rank and category.</p>
            <p className="text-slate-400 text-sm mt-1">Try a higher rank or different category.</p>
          </CardContent>
        </Card>
      )}

      {searched && results.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          {[safe, moderate, ambitious].map((group) =>
            group.map((col) => {
              const cfg = probConfig[col.probability]
              return (
                <div
                  key={`${col.college_code}-${col.branch_code}`}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {col.college_code}
                        </span>
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      </div>
                      <h3 className="font-semibold text-slate-800 text-sm leading-snug">{col.college_name}</h3>
                      <p className="text-blue-600 text-sm mt-0.5">{col.branch_name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-400 mb-0.5">{col.year} {col.round} Cutoff</div>
                      <div className="font-bold text-slate-800 text-base">{col.closing_rank.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {!searched && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">Enter your rank and category above to find matching colleges</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
