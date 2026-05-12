'use client'
import { useState, useEffect, useMemo } from 'react'
import { GitCompare, X, Plus, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Select } from '@/components/ui/Input'
import { CATEGORIES } from '@/lib/constants'
import type { CutoffRecord } from '@/types'

interface CollegeDetail { code: string; name: string; city: string; type: string; nirf_rank: number | null; website: string | null }

export default function ComparePage() {
  const [data, setData] = useState<CutoffRecord[]>([])
  const [colleges, setColleges] = useState<CollegeDetail[]>([])
  const [selected, setSelected] = useState<string[]>(['', ''])
  const [category, setCategory] = useState('GM')
  const [year, setYear] = useState(2025)
  const [round, setRound] = useState('Round 3')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/data/college_details.json').then(r => r.json()),
      fetch('/data/cutoffs_latest.json').then(r => r.json()),
    ]).then(([cols, cuts]) => {
      setColleges(cols)
      setData(cuts)
      setLoading(false)
    })
  }, [])

  function setCollege(idx: number, code: string) {
    setSelected(prev => { const n = [...prev]; n[idx] = code; return n })
  }

  function addSlot() { if (selected.length < 3) setSelected(prev => [...prev, '']) }
  function removeSlot(idx: number) { setSelected(prev => prev.filter((_, i) => i !== idx)) }

  const collegeOptions = colleges.map(c => ({ value: c.code, label: `${c.code} – ${c.name.slice(0, 40)}` }))

  // Get all branches for selected colleges
  const allBranches = useMemo(() => {
    const set = new Map<string, string>()
    data.filter(r => r.category === category).forEach(r => set.set(r.branch_code, r.branch_name))
    return Array.from(set.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [data, category])

  function getRank(collegeCode: string, branchCode: string) {
    const rec = data.find(r =>
      r.college_code === collegeCode &&
      r.branch_code === branchCode &&
      r.category === category
    )
    return rec ? rec.closing_rank : null
  }

  function getCollegeInfo(code: string) {
    return colleges.find(c => c.code === code)
  }

  const selectedCols = selected.filter(s => s !== '')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <GitCompare className="w-5 h-5" />
          <span className="text-sm font-medium">College Comparison</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Compare Colleges Side by Side</h1>
        <p className="text-slate-500 mt-1.5">Select up to 3 colleges and compare cutoffs across all branches</p>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardContent className="pt-5 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Select label="Category" value={category} onChange={e => setCategory(e.target.value)} options={CATEGORIES} />
            <Select label="Year" value={year} onChange={e => setYear(Number(e.target.value))}
              options={[{value:2025,label:'2025'},{value:2024,label:'2024'},{value:2023,label:'2023'}]} />
            <Select label="Round" value={round} onChange={e => setRound(e.target.value)}
              options={['Round 1','Round 2','Round 3','Extended Round'].map(r=>({value:r,label:r}))} />
          </div>

          {/* College selectors */}
          <div className="flex flex-wrap gap-3 items-end">
            {selected.map((code, idx) => (
              <div key={idx} className="flex items-end gap-2 flex-1 min-w-[200px]">
                <Select
                  label={`College ${idx + 1}`}
                  value={code}
                  onChange={e => setCollege(idx, e.target.value)}
                  placeholder="Select college…"
                  options={collegeOptions}
                />
                {idx >= 2 && (
                  <button onClick={() => removeSlot(idx)} className="mb-0.5 p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {selected.length < 3 && (
              <button onClick={addSlot}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors mb-0.5">
                <Plus className="w-4 h-4" /> Add College
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* College info cards */}
      {selectedCols.length > 0 && (
        <div className={`grid gap-4 mb-6 grid-cols-${selectedCols.length}`}
          style={{ gridTemplateColumns: `repeat(${selectedCols.length}, 1fr)` }}>
          {selectedCols.map(code => {
            const info = getCollegeInfo(code)
            if (!info) return null
            return (
              <Card key={code} className="border-blue-200">
                <CardContent className="pt-4 pb-4">
                  <span className="text-xs font-mono text-slate-400">{info.code}</span>
                  <h3 className="font-semibold text-slate-800 text-sm mt-0.5 leading-snug">{info.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{info.city} · {info.type}</p>
                  {info.nirf_rank && (
                    <p className="text-xs text-yellow-600 font-medium mt-1">NIRF #{info.nirf_rank}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Comparison table */}
      {selectedCols.length >= 2 && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Branch-wise Cutoff Comparison — {category} · {year} {round}
            </h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-3 py-3 font-medium text-slate-600">Branch</th>
                    {selectedCols.map(code => (
                      <th key={code} className="text-right px-3 py-3 font-medium text-slate-600">
                        {code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allBranches.map(([bc, bn]) => {
                    const ranks = selectedCols.map(code => getRank(code, bc))
                    if (ranks.every(r => r === null)) return null
                    const minRank = Math.min(...ranks.filter(r => r !== null) as number[])
                    return (
                      <tr key={bc} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 text-slate-700">{bn}</td>
                        {ranks.map((rank, i) => (
                          <td key={i} className={`px-3 py-2.5 text-right font-bold ${
                            rank === minRank ? 'text-green-600' : 'text-slate-700'
                          }`}>
                            {rank ? rank.toLocaleString('en-IN') : <span className="text-slate-300 font-normal">—</span>}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              🟢 Green = lowest (most competitive) cutoff rank for that branch
            </p>
          </CardContent>
        </Card>
      )}

      {selectedCols.length < 2 && !loading && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <GitCompare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">Select at least 2 colleges to compare</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
