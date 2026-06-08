import { CutoffRecord, CollegePrediction } from '@/types'

export function filterCutoffs(
  data: CutoffRecord[],
  filters: {
    year?: number
    round?: string
    category?: string
    college?: string
    branch?: string
    searchQuery?: string
  }
): CutoffRecord[] {
  return data.filter((r) => {
    if (filters.year && r.year !== filters.year) return false
    if (filters.round && r.round !== filters.round) return false
    if (filters.category && r.category !== filters.category) return false
    if (filters.college && r.college_code !== filters.college) return false
    if (filters.branch && r.branch_code !== filters.branch) return false
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      if (
        !r.college_name.toLowerCase().includes(q) &&
        !r.branch_name.toLowerCase().includes(q) &&
        !r.college_code.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })
}

function getBestCutoffMap(
  data: CutoffRecord[],
  category: string,
  branchFilter?: string
): { map: Map<string, CutoffRecord>; year: number; round: string; usedCategory: string } {
  const branchOk = (r: CutoffRecord) =>
    branchFilter ? r.branch_code === branchFilter : true

  const attempts: [number, string, string][] = [
    [2025, 'Round 3', category],
    [2025, 'Round 2', category],
    [2025, 'Round 1', category],
    [2024, 'Extended Round', category],
    [2024, 'Round 2', category],
    [2024, 'Round 1', category],
    [2023, 'Round 2', category],
    [2023, 'Round 1', category],
    [2025, 'Round 3', 'GM'],
    [2025, 'Round 2', 'GM'],
    [2025, 'Round 1', 'GM'],
    [2024, 'Round 2', 'GM'],
  ]

  for (const [year, round, cat] of attempts) {
    const subset = data.filter(
      (r) =>
        r.year === year &&
        r.round === round &&
        r.category === cat &&
        branchOk(r)
    )

    if (subset.length >= 5) {
      const map = new Map<string, CutoffRecord>()
      for (const r of subset) {
        const key = `${r.college_code}||${r.branch_code}`
        if (!map.has(key)) map.set(key, r)
      }
      return { map, year, round, usedCategory: cat }
    }
  }

  return { map: new Map(), year: 2025, round: 'Round 3', usedCategory: category }
}

export function predictColleges(
  data: CutoffRecord[],
  studentRank: number,
  category: string,
  branchFilter?: string
): {
  predictions: CollegePrediction[]
  dataYear: number
  dataRound: string
  usedCategory: string
} {
  const { map, year, round, usedCategory } = getBestCutoffMap(data, category, branchFilter)

  if (map.size === 0) {
    return { predictions: [], dataYear: 2025, dataRound: 'Round 3', usedCategory: category }
  }

  /**
   * Rank logic: lower rank = better student
   * Student rank R, College closing rank C
   * Student gets in when R <= C
   *
   * Ambitious: R > C and R <= C*1.15  (just missed, within 15%)
   * Moderate:  R <= C and R > C*0.85  (can get in, small buffer)
   * Safe:      R <= C*0.85 and R >= C*0.45  (comfortable margin, not too easy)
   * Skip:      R > C*1.15 (too hard) or R < C*0.45 (too easy - irrelevant)
   *
   * For rank 20,000: shows cutoffs 17,400 to 44,400 only
   */

  const results: CollegePrediction[] = []

  for (const record of map.values()) {
    const C = record.closing_rank
    if (!C || C <= 0) continue

    let probability: 'Safe' | 'Moderate' | 'Ambitious'

    if (studentRank > C && studentRank <= Math.round(C * 1.15)) {
      probability = 'Ambitious'
    } else if (studentRank <= C && studentRank > Math.round(C * 0.85)) {
      probability = 'Moderate'
    } else if (studentRank <= Math.round(C * 0.85) && studentRank >= Math.round(C * 0.45)) {
      probability = 'Safe'
    } else {
      continue
    }

    results.push({
      college_code: record.college_code,
      college_name: record.college_name,
      branch_code: record.branch_code,
      branch_name: record.branch_name,
      closing_rank: C,
      probability,
      year: record.year,
      round: record.round,
    })
  }

  const order = { Safe: 0, Moderate: 1, Ambitious: 2 }
  results.sort((a, b) => {
    if (order[a.probability] !== order[b.probability])
      return order[a.probability] - order[b.probability]
    return a.closing_rank - b.closing_rank
  })

  return {
    predictions: results.slice(0, 200),
    dataYear: year,
    dataRound: round,
    usedCategory,
  }
}

export function getUniqueValues<T extends keyof CutoffRecord>(
  data: CutoffRecord[],
  key: T
): CutoffRecord[T][] {
  return Array.from(new Set(data.map((r) => r[key]))).sort() as CutoffRecord[T][]
}
