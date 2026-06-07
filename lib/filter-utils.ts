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

/**
 * Get the best available cutoff dataset for a category.
 *
 * Priority:
 * 1. 2025 Round 3 for requested category
 * 2. 2025 Round 2 for requested category
 * 3. 2025 Round 1 for requested category
 * 4. 2024 Extended Round for requested category
 * 5. 2024 Round 2 for requested category
 * 6. Any year Round 1 for requested category
 * 7. Fall back to GM category if no data for requested category
 */
function getBestCutoffs(
  data: CutoffRecord[],
  category: string,
  branchFilter?: string
): { records: CutoffRecord[]; year: number; round: string; usedCategory: string } {
  const branchCheck = (r: CutoffRecord) =>
    branchFilter ? r.branch_code === branchFilter : true

  const attempts: [number, string][] = [
    [2025, 'Round 3'],
    [2025, 'Round 2'],
    [2025, 'Round 1'],
    [2024, 'Extended Round'],
    [2024, 'Round 2'],
    [2024, 'Round 1'],
    [2023, 'Round 2'],
    [2023, 'Round 1'],
  ]

  // Try exact category first
  for (const [year, round] of attempts) {
    const subset = data.filter(
      (r) =>
        r.year === year &&
        r.round === round &&
        r.category === category &&
        branchCheck(r)
    )
    if (subset.length >= 5) {
      return { records: subset, year, round, usedCategory: category }
    }
  }

  // Fall back to GM if selected category has insufficient data
  for (const [year, round] of attempts) {
    const subset = data.filter(
      (r) =>
        r.year === year &&
        r.round === round &&
        r.category === 'GM' &&
        branchCheck(r)
    )
    if (subset.length >= 5) {
      return { records: subset, year, round, usedCategory: 'GM' }
    }
  }

  return { records: [], year: 2025, round: 'Round 3', usedCategory: category }
}

export function predictColleges(
  data: CutoffRecord[],
  studentRank: number,
  category: string,
  branchFilter?: string
): { predictions: CollegePrediction[]; dataYear: number; dataRound: string; usedCategory: string } {
  const { records, year, round, usedCategory } = getBestCutoffs(
    data,
    category,
    branchFilter
  )

  if (records.length === 0) {
    return { predictions: [], dataYear: 2025, dataRound: 'Round 3', usedCategory: category }
  }

  // Deduplicate: keep one record per college+branch (use the one with best data)
  const seen = new Map<string, CutoffRecord>()
  for (const r of records) {
    const key = `${r.college_code}-${r.branch_code}`
    if (!seen.has(key)) seen.set(key, r)
  }
  const unique = Array.from(seen.values())

  const results: CollegePrediction[] = []

  for (const record of unique) {
    const cutoff = record.closing_rank

    // Skip if cutoff is 0 or invalid
    if (!cutoff || cutoff <= 0) continue

    /**
     * Probability logic:
     * - Safe: student rank is comfortably BELOW (better than) cutoff
     *   → student rank ≤ cutoff × 0.80 (at least 20% margin)
     * - Moderate: student rank is near the cutoff
     *   → cutoff × 0.80 < student rank ≤ cutoff × 1.0
     * - Ambitious: student rank is slightly ABOVE (worse than) cutoff
     *   → cutoff × 1.0 < student rank ≤ cutoff × 1.20
     * - Skip: student rank is too far above cutoff (> 20% worse)
     *
     * Note: Lower rank number = better performance
     */
    let probability: 'Safe' | 'Moderate' | 'Ambitious'

    if (studentRank <= Math.round(cutoff * 0.80)) {
      probability = 'Safe'
    } else if (studentRank <= cutoff) {
      probability = 'Moderate'
    } else if (studentRank <= Math.round(cutoff * 1.20)) {
      probability = 'Ambitious'
    } else {
      continue // rank too far above cutoff
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

  // Sort: Safe → Moderate → Ambitious, then by closing_rank ascending
  const order = { Safe: 0, Moderate: 1, Ambitious: 2 }
  results.sort((a, b) => {
    if (order[a.probability] !== order[b.probability])
      return order[a.probability] - order[b.probability]
    return a.closing_rank - b.closing_rank
  })

  return {
    predictions: results.slice(0, 150),
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
