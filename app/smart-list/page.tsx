'use client'
import { useState, useEffect } from 'react'
import { Sparkles, Download, Info } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { predictColleges } from '@/lib/filter-utils'
import { CATEGORIES } from '@/lib/constants'
import type { CutoffRecord, CollegePrediction } from '@/types'

const CITY_OPTIONS = [
  { value: '', label: 'Any City' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Mysore', label: 'Mysore' },
  { value: 'Hubli', label: 'Hubli' },
  { value: 'Belgaum', label: 'Belgaum' },
  { value: 'Mangalore', label: 'Mangalore' },
  { value: 'Tumkur', label: 'Tumkur' },
  { value: 'Dharwad', label: 'Dharwad' },
]

const COLLEGE_TYPE_OPTIONS = [
  { value: '', label: 'Any Type' },
  { value: 'Government', label: 'Government Only' },
  { value: 'Government Aided', label: 'Government Aided' },
  { value: 'Private', label: 'Private' },
]

interface CollegeDetailMap { [code: string]: { city: string; type: string } }

export default function SmartListPage() {
  const [cutoffs, setCutoffs] = useState<CutoffRecord[]>([])
  const [collegeDetails, setCollegeDetails] = useState<CollegeDetailMap>({})
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [results, setResults] = useState<CollegePrediction[]>([])
  const [generated, setGenerated] = useState(false)

  // Form
  const [rank, setRank] = useState('')
  const [category, setCategory] = useState('GM')
  const [cityPref, setCityPref] = useState('')
  const [typePref, setTypePref] = useState('')
  const [rankError, setRankError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/data/cutoffs_latest.json').then(r => r.json()),
      fetch('/data/college_details.json').then(r => r.json()),
    ]).then(([cuts, cols]) => {
      setCutoffs(cuts)
      const map: CollegeDetailMap = {}
      cols.forEach((c: { code: string; city: string; type: string }) => { map[c.code] = { city: c.city, type: c.type } })
      setCollegeDetails(map)
      setDataLoading(false)
    })
  }, [])

  function generate() {
    const r = Number(rank)
    if (!rank || isNaN(r) || r < 1) { setRankError('Enter a valid rank'); return }
    setRankError('')
    setLoading(true)
    setTimeout(() => {
      let res = predictColleges(cutoffs, r, category)
      // Apply city/type filters
      if (cityPref) res = res.filter(c => collegeDetails[c.college_code]?.city === cityPref)
      if (typePref) res = res.filter(c => collegeDetails[c.college_code]?.type === typePref)
      setResults(res)
      setGenerated(true)
      setLoading(false)
    }, 500)
  }

  const safe = results.filter(r => r.probability === 'Safe')
  const moderate = results.filter(r => r.probability === 'Moderate')
  const ambitious = results.filter(r => r.probability === 'Ambitious')

  function printList() { window.print() }

  const probConfig = {
    Safe: { variant: 'safe' as const },
    Moderate: { variant: 'moderate' as const },
    Ambitious: { variant: 'ambitious' as const },
  }

  function Section({ title, items, color }: { title: string; items: CollegePrediction[]; color: string }) {
    if (items.length === 0) return null
    return (
      <div className="mb-6">
        <h3 className={`font-bold text-base mb-3 ${color}`}>{title} ({items.length})</h3>
        <div className="space-y-2">
          {items.map((c, i) => (
            <div key={i} className="flex items-start justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono text-slate-400">{c.college_code}</span>
                  <Badge variant={probConfig[c.probability].variant}>{c.probability}</Badge>
                  {collegeDetails[c.college_code] && (
                    <span className="text-xs text-slate-400">{collegeDetails[c.college_code].city}</span>
                  )}
                </div>
                <p className="font-medium text-slate-800 text-sm leading-snug">{c.college_name}</p>
                <p className="text-blue-600 text-xs mt-0.5">{c.branch_name}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-400">2025 Cutoff</p>
                <p className="font-bold text-slate-800">{c.closing_rank.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-violet-600 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">Smart College List</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Your Personalised College List</h1>
        <p className="text-slate-500 mt-1.5">Get a tailored list of Safe, Moderate & Ambitious options</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <Input label="Your Rank" type="number" placeholder="e.g. 8500"
              value={rank} onChange={e => { setRank(e.target.value); setRankError('') }} error={rankError} />
            <Select label="Category" value={category} onChange={e => setCategory(e.target.value)} options={CATEGORIES} />
            <Select label="City Preference" value={cityPref} onChange={e => setCityPref(e.target.value)} options={CITY_OPTIONS} />
            <Select label="College Type" value={typePref} onChange={e => setTypePref(e.target.value)} options={COLLEGE_TYPE_OPTIONS} />
          </div>
          <Button onClick={generate} loading={loading || dataLoading} size="lg" className="w-full">
            {dataLoading ? 'Loading data…' : '✨ Generate My College List'}
          </Button>
          <div className="mt-3 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700">Based on 2025 KCET Round 3 cutoffs. All branches shown unless filtered.</p>
          </div>
        </CardContent>
      </Card>

      {generated && results.length > 0 && (
        <div className="animate-slide-up">
          {/* Summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex gap-3 flex-wrap">
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm">
                <span className="font-bold text-green-700">{safe.length}</span> <span className="text-green-600">Safe</span>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-sm">
                <span className="font-bold text-yellow-700">{moderate.length}</span> <span className="text-yellow-600">Moderate</span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm">
                <span className="font-bold text-red-700">{ambitious.length}</span> <span className="text-red-600">Ambitious</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={printList}>
              <Download className="w-4 h-4" /> Print / Save PDF
            </Button>
          </div>

          {/* Header for print */}
          <div className="hidden print:block mb-6 border-b pb-4">
            <h2 className="text-xl font-bold">CutoffBuddy – My College List</h2>
            <p className="text-sm text-slate-500">Rank: {rank} · Category: {category} · Generated from cutoffbuddy.vercel.app</p>
          </div>

          <Section title="✅ Safe Options" items={safe} color="text-green-700" />
          <Section title="⚡ Moderate Options" items={moderate} color="text-yellow-700" />
          <Section title="🎯 Ambitious Options" items={ambitious} color="text-red-700" />
        </div>
      )}

      {generated && results.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-14 text-center">
            <p className="text-slate-500">No colleges found for your filters. Try removing city/type filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
