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

export function predictColleges(
  data: CutoffRecord[],
  studentRank: number,
  category: string,
  branchFilter?: string
): CollegePrediction[] {
  // Use latest available round (prefer 2025 Round 3, fallback to Round 2, then 2024)
  const yearRounds: [number, string][] = [
    [2025, 'Round 3'],
    [2025, 'Round 2'],
    [2025, 'Round 1'],
    [2024, 'Extended Round'],
    [2024, 'Round 2'],
  ]

  let relevant: CutoffRecord[] = []
  for (const [year, round] of yearRounds) {
    const subset = data.filter(
      (r) =>
        r.year === year &&
        r.round === round &&
        r.category === category &&
        (branchFilter ? r.branch_code === branchFilter : true)
    )
    if (subset.length > 10) {
      relevant = subset
      break
    }
  }

  if (relevant.length === 0) {
    // Fallback: use GM category if selected category has no data
    relevant = data.filter(
      (r) =>
        r.year === 2025 &&
        r.category === 'GM' &&
        (branchFilter ? r.branch_code === branchFilter : true)
    )
  }

  const results: CollegePrediction[] = []

  for (const record of relevant) {
    const cutoff = record.closing_rank
    let probability: 'Safe' | 'Moderate' | 'Ambitious'

    if (studentRank <= cutoff * 0.75) {
      probability = 'Safe'
    } else if (studentRank <= cutoff * 1.0) {
      probability = 'Moderate'
    } else if (studentRank <= cutoff * 1.25) {
      probability = 'Ambitious'
    } else {
      continue // rank too high, skip
    }

    results.push({
      college_code: record.college_code,
      college_name: record.college_name,
      branch_code: record.branch_code,
      branch_name: record.branch_name,
      closing_rank: cutoff,
      probability,
      year: record.year,
      round: record.round,
    })
  }

  // Sort: Safe first, then Moderate, then Ambitious; within each by closing_rank
  const order = { Safe: 0, Moderate: 1, Ambitious: 2 }
  results.sort((a, b) => {
    if (order[a.probability] !== order[b.probability])
      return order[a.probability] - order[b.probability]
    return a.closing_rank - b.closing_rank
  })

  return results.slice(0, 100) // cap at 100
}

export function getUniqueValues<T extends keyof CutoffRecord>(
  data: CutoffRecord[],
  key: T
): CutoffRecord[T][] {
  return Array.from(new Set(data.map((r) => r[key]))).sort() as CutoffRecord[T][]
}
