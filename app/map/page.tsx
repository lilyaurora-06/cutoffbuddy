'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Input'

interface CollegeDetail {
  code: string; name: string; city: string; type: string
  lat: number; lng: number; website: string | null; nirf_rank: number | null
}

const CITY_FILTER_OPTIONS = [
  { value: '', label: 'All Cities' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Mysore', label: 'Mysore' },
  { value: 'Hubli', label: 'Hubli' },
  { value: 'Belgaum', label: 'Belgaum' },
  { value: 'Mangalore', label: 'Mangalore' },
  { value: 'Tumkur', label: 'Tumkur' },
  { value: 'Dharwad', label: 'Dharwad' },
  { value: 'Davanagere', label: 'Davanagere' },
  { value: 'Hassan', label: 'Hassan' },
]

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'Government', label: 'Government' },
  { value: 'Government Aided', label: 'Government Aided' },
  { value: 'Private', label: 'Private' },
]

export default function MapPage() {
  const [colleges, setColleges] = useState<CollegeDetail[]>([])
  const [cityFilter, setCityFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selected, setSelected] = useState<CollegeDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/college_details.json').then(r => r.json()).then(d => {
      setColleges(d)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => colleges.filter(c => {
    if (cityFilter && c.city !== cityFilter) return false
    if (typeFilter && c.type !== typeFilter) return false
    return true
  }), [colleges, cityFilter, typeFilter])

  // Karnataka bounding box: lat 11.5-18.5, lng 74-78.5
  // Map SVG projection
  const MAP_W = 500, MAP_H = 600
  const LAT_MIN = 11.5, LAT_MAX = 18.5, LNG_MIN = 74, LNG_MAX = 78.5

  function project(lat: number, lng: number) {
    const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * MAP_W
    const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAP_H
    return { x, y }
  }

  const TYPE_COLORS: Record<string, string> = {
    'Government': '#22c55e',
    'Government Aided': '#3b82f6',
    'Private': '#f59e0b',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <MapPin className="w-5 h-5" />
          <span className="text-sm font-medium">College Map</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Karnataka Engineering Colleges Map</h1>
        <p className="text-slate-500 mt-1.5">All {colleges.length} KCET colleges plotted across Karnataka</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel */}
        <div className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-4 pb-4 space-y-3">
              <Select label="Filter by City" value={cityFilter}
                onChange={e => setCityFilter(e.target.value)} options={CITY_FILTER_OPTIONS} />
              <Select label="Filter by Type" value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)} options={TYPE_OPTIONS} />
              <p className="text-xs text-slate-500">{filtered.length} colleges shown</p>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Legend</h3>
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-sm text-slate-600">{type}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Selected college info */}
          {selected && (
            <Card className="border-blue-200 animate-slide-up">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-slate-400">{selected.code}</span>
                    <h3 className="font-semibold text-slate-800 text-sm mt-0.5 leading-snug">{selected.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{selected.city} · {selected.type}</p>
                    {selected.nirf_rank && (
                      <p className="text-xs text-yellow-600 font-medium mt-1">NIRF #{selected.nirf_rank}</p>
                    )}
                  </div>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/colleges/${selected.code}`}
                    className="flex-1 text-center text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    View Details
                  </Link>
                  {selected.website && (
                    <a href={selected.website} target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                      Website
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* College list */}
          <Card>
            <CardContent className="pt-4 pb-2">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">College List</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {filtered.map(c => (
                  <button key={c.code} onClick={() => setSelected(c)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      selected?.code === c.code ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'
                    }`}>
                    <span className="font-mono text-slate-400 mr-1.5">{c.code}</span>
                    {c.name.slice(0, 35)}…
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative bg-slate-100 rounded-2xl overflow-hidden" style={{ height: '600px' }}>
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">Loading map…</div>
              ) : (
                <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full h-full"
                  style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)' }}>
                  {/* Karnataka outline approximation */}
                  <ellipse cx="250" cy="300" rx="220" ry="270" fill="#dcfce7" stroke="#86efac" strokeWidth="2" opacity="0.5" />

                  {/* City labels */}
                  {[
                    { name: 'Bangalore', lat: 12.97, lng: 77.59 },
                    { name: 'Mysore', lat: 12.30, lng: 76.64 },
                    { name: 'Hubli', lat: 15.36, lng: 75.12 },
                    { name: 'Mangalore', lat: 12.91, lng: 74.86 },
                    { name: 'Belgaum', lat: 15.85, lng: 74.50 },
                  ].map(city => {
                    const { x, y } = project(city.lat, city.lng)
                    return (
                      <text key={city.name} x={x} y={y} fontSize="10" fill="#64748b"
                        textAnchor="middle" className="pointer-events-none select-none">
                        {city.name}
                      </text>
                    )
                  })}

                  {/* College dots */}
                  {filtered.map(c => {
                    const { x, y } = project(c.lat, c.lng)
                    const color = TYPE_COLORS[c.type] || '#94a3b8'
                    const isSelected = selected?.code === c.code
                    return (
                      <g key={c.code} onClick={() => setSelected(c)} className="cursor-pointer">
                        <circle cx={x} cy={y} r={isSelected ? 8 : 5}
                          fill={color} stroke="white" strokeWidth={isSelected ? 2.5 : 1.5}
                          opacity={isSelected ? 1 : 0.8} />
                        {isSelected && (
                          <text x={x} y={y - 11} fontSize="9" fill="#1e293b"
                            textAnchor="middle" fontWeight="bold" className="pointer-events-none">
                            {c.code}
                          </text>
                        )}
                      </g>
                    )
                  })}
                </svg>
              )}

              {/* Stats overlay */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
                <p className="text-xs text-slate-600">
                  Showing <span className="font-bold text-slate-800">{filtered.length}</span> colleges
                </p>
                <p className="text-xs text-slate-400">Click any dot to see details</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
