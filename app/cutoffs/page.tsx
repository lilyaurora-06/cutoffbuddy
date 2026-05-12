'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { BarChart2, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { filterCutoffs } from '@/lib/filter-utils'
import { CATEGORIES, YEARS, ROUNDS } from '@/lib/constants'
import type { CutoffRecord } from '@/types'

const PAGE_SIZE = 50

export default function CutoffsPage() {
  const [allData, setAllData] = useState<CutoffRecord[]>([])
  const [loadedYears, setLoadedYears] = useState<number[]>([])
  const [loadingYear, setLoadingYear] = useState<number | null>(null)

  const [search, setSearch] = useState('')
  const [year, setYear] = useState<number>(2025)
  const [round, setRound] = useState('')
  const [category, setCategory] = useState('GM')
  const [college, setCollege] = useState('')
  const [branch, setBranch] = useState('')
  const [page, setPage] = useState(1)
  const [sortAsc, setSortAsc] = useState(true)

  // Load year data on demand
  const loadYear = useCallback(async (y: number) => {
    if (loadedYears.includes(y)) return
    setLoadingYear(y)
    try {
      const res = await fetch(`/data/cutoffs_${y}.json`)
      const data: CutoffRecord[] = await res.json()
      setAllData((prev) => [...prev, ...data])
      setLoadedYears((prev) => [...prev, y])
    } finally {
      setLoadingYear(null)
    }
  }, [loadedYears])

  useEffect(() => { loadYear(2025) }, [])

  useEffect(() => {
    setPage(1)
    loadYear(year)
  }, [year])

  const yearData = useMemo(() => allData.filter((r) => r.year === year), [allData, year])

  const colleges = useMemo(() => {
    const map = new Map<string, string>()
    yearData.forEach((r) => map.set(r.college_code, r.college_name))
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [yearData])

  const branches = useMemo(() => {
    const map = new Map<string, string>()
    yearData.forEach((r) => map.set(r.branch_code, r.branch_name))
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [yearData])

  const filtered = useMemo(() => {
    let result = filterCutoffs(yearData, {
      year, round: round || undefined,
      category: category || undefined,
      college: college || undefined,
      branch: branch || undefined,
      searchQuery: search || undefined,
    })
    result = [...result].sort((a, b) => sortAsc
      ? a.closing_rank - b.closing_rank
      : b.closing_rank - a.closing_rank)
    return result
  }, [yearData, year, round, category, college, branch, search, sortAsc])

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < filtered.length

  function resetFilters() {
    setSearch(''); setRound(''); setCategory('GM'); setCollege(''); setBranch(''); setPage(1)
  }

  const availableRounds = useMemo(() => {
    const set = new Set(yearData.map((r) => r.round))
    return ROUNDS.filter((r) => set.has(r))
  }, [yearData])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <BarChart2 className="w-5 h-5" />
          <span className="text-sm font-medium">Cutoff Explorer</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Explore KCET Cutoffs</h1>
        <p className="text-slate-500 mt-1.5">Real cutoff data for 256+ colleges — all categories, all rounds</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-5 pb-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Select
              label="Year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              options={YEARS.map((y) => ({ value: y, label: String(y) }))}
            />
            <Select
              label="Round"
              value={round}
              onChange={(e) => setRound(e.target.value)}
              placeholder="All Rounds"
              options={availableRounds.map((r) => ({ value: r, label: r }))}
            />
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="All Categories"
              options={CATEGORIES}
            />
            <Select
              label="College"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="All Colleges"
              options={colleges.map(([code, name]) => ({ value: code, label: `${code} – ${name.slice(0, 35)}` }))}
            />
            <Select
              label="Branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="All Branches"
              options={branches.map(([code, name]) => ({ value: code, label: name }))}
            />
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="College / branch…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <div className="text-sm text-slate-500">
              {loadingYear ? (
                <span className="text-blue-600">Loading {loadingYear} data…</span>
              ) : (
                <span><span className="font-semibold text-slate-700">{filtered.length.toLocaleString()}</span> records found</span>
              )}
            </div>
            <button onClick={resetFilters} className="text-xs text-blue-600 hover:underline">Reset filters</button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-medium text-slate-600 w-16">Code</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">College Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Branch</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 w-24">Category</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 w-28">Round</th>
                <th
                  className="text-right px-4 py-3 font-medium text-slate-600 w-32 cursor-pointer select-none"
                  onClick={() => setSortAsc(!sortAsc)}
                >
                  <span className="inline-flex items-center gap-1 justify-end">
                    Closing Rank
                    {sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 && !loadingYear ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400">
                    No records match your filters
                  </td>
                </tr>
              ) : (
                paginated.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{r.college_code}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 leading-snug max-w-xs">{r.college_name}</td>
                    <td className="px-4 py-3 text-slate-600 leading-snug">{r.branch_name}</td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium">
                        {r.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{r.round}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">
                      {r.closing_rank.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="p-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Load more ({filtered.length - paginated.length} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
