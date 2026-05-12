'use client'
import { useState } from 'react'
import { TrendingUp, Info, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { predictRank, formatRankFull } from '@/lib/rank-utils'
import { CATEGORIES } from '@/lib/constants'
import type { RankPrediction } from '@/types'

interface FormState {
  physics: string
  chemistry: string
  maths: string
  boardPhysics: string
  boardChemistry: string
  boardMaths: string
  category: string
}

const INITIAL: FormState = {
  physics: '', chemistry: '', maths: '',
  boardPhysics: '', boardChemistry: '', boardMaths: '',
  category: 'GM',
}

function validate(f: FormState) {
  const errs: Partial<FormState> = {}
  const fields: [keyof FormState, number, string][] = [
    ['physics', 60, 'Physics (0–60)'],
    ['chemistry', 60, 'Chemistry (0–60)'],
    ['maths', 60, 'Maths (0–60)'],
    ['boardPhysics', 100, 'Board Physics (0–100)'],
    ['boardChemistry', 100, 'Board Chemistry (0–100)'],
    ['boardMaths', 100, 'Board Maths (0–100)'],
  ]
  for (const [key, max, label] of fields) {
    const v = Number(f[key])
    if (f[key] === '') { errs[key] = `${label} is required`; continue }
    if (isNaN(v) || v < 0 || v > max) errs[key] = `Must be 0–${max}`
  }
  return errs
}

export default function RankPredictorPage() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [result, setResult] = useState<RankPrediction | null>(null)
  const [loading, setLoading] = useState(false)

  function set(key: keyof FormState, val: string) {
    setForm((p) => ({ ...p, [key]: val }))
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }))
  }

  function handleSubmit() {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => {
      const boardTotal = Number(form.boardPhysics) + Number(form.boardChemistry) + Number(form.boardMaths)
      const pred = predictRank(
        Number(form.physics), Number(form.chemistry), Number(form.maths), boardTotal
      )
      setResult(pred)
      setLoading(false)
    }, 600)
  }

  function reset() { setForm(INITIAL); setErrors({}); setResult(null) }

  const confidenceVariant = result?.confidence === 'High' ? 'safe' : result?.confidence === 'Medium' ? 'moderate' : 'ambitious'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm font-medium">Rank Predictor</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Predict Your KCET Rank</h1>
        <p className="text-slate-500 mt-1.5">
          Based on KEA's official merit formula: (KCET% + Board PCM%) ÷ 2
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-700">KCET Marks <span className="text-slate-400 font-normal text-sm">(out of 60 each)</span></h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input label="Physics" type="number" placeholder="e.g. 52" min={0} max={60}
                value={form.physics} onChange={(e) => set('physics', e.target.value)} error={errors.physics} />
              <Input label="Chemistry" type="number" placeholder="e.g. 48" min={0} max={60}
                value={form.chemistry} onChange={(e) => set('chemistry', e.target.value)} error={errors.chemistry} />
              <Input label="Mathematics" type="number" placeholder="e.g. 55" min={0} max={60}
                value={form.maths} onChange={(e) => set('maths', e.target.value)} error={errors.maths} />
            </div>
          </CardContent>

          <CardHeader className="pt-2">
            <h2 className="font-semibold text-slate-700">Board Marks <span className="text-slate-400 font-normal text-sm">(out of 100 each)</span></h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input label="Board Physics" type="number" placeholder="e.g. 88" min={0} max={100}
                value={form.boardPhysics} onChange={(e) => set('boardPhysics', e.target.value)} error={errors.boardPhysics} />
              <Input label="Board Chemistry" type="number" placeholder="e.g. 82" min={0} max={100}
                value={form.boardChemistry} onChange={(e) => set('boardChemistry', e.target.value)} error={errors.boardChemistry} />
              <Input label="Board Mathematics" type="number" placeholder="e.g. 92" min={0} max={100}
                value={form.boardMaths} onChange={(e) => set('boardMaths', e.target.value)} error={errors.boardMaths} />

              <Select label="Your Category" value={form.category}
                onChange={(e) => set('category', e.target.value)}
                options={CATEGORIES} />

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSubmit} loading={loading} className="flex-1" size="lg">
                  {loading ? 'Predicting…' : 'Predict Rank'}
                </Button>
                {result && (
                  <Button variant="secondary" onClick={reset} size="lg">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        <div className="space-y-4">
          {result ? (
            <Card className="animate-slide-up border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <Badge variant={confidenceVariant} className="mb-3">
                    {result.confidence} Confidence
                  </Badge>
                  <p className="text-sm text-slate-500 mb-1">Expected Rank Range</p>
                  <div className="text-4xl font-extrabold text-slate-800 my-2">
                    {formatRankFull(result.low)}
                    <span className="text-slate-400 mx-2">–</span>
                    {formatRankFull(result.high)}
                  </div>
                  <p className="text-xs text-slate-500">Composite Merit Score: <span className="font-semibold text-slate-700">{result.compositeScore}%</span></p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">KCET Total</span>
                    <span className="font-medium">{Number(form.physics) + Number(form.chemistry) + Number(form.maths)} / 180</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Board PCM Total</span>
                    <span className="font-medium">{Number(form.boardPhysics) + Number(form.boardChemistry) + Number(form.boardMaths)} / 300</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 mt-1">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium">{form.category}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    This is an estimate. Actual rank depends on total candidates and normalization. Use this as a guide, not a guarantee.
                  </p>
                </div>

                <a
                  href="/college-predictor"
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Find Colleges for This Rank →
                </a>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center py-16">
                <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Fill in your marks and click<br /><span className="font-medium text-slate-500">Predict Rank</span> to see results</p>
              </CardContent>
            </Card>
          )}

          {/* Formula info */}
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="pt-5 pb-5">
              <h3 className="font-semibold text-blue-800 text-sm mb-2">How the formula works</h3>
              <ol className="text-xs text-blue-700 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>KCET% = (Physics + Chemistry + Maths) ÷ 180 × 100</li>
                <li>Board PCM% = (P + C + M marks) ÷ 300 × 100</li>
                <li>Merit Score = (KCET% + Board PCM%) ÷ 2</li>
                <li>Rank = position in descending order of Merit Score</li>
              </ol>
              <p className="text-xs text-blue-600 mt-2">Source: KEA Official Allotment Process</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
