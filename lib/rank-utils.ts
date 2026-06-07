/**
 * KCET 2026 Rank Prediction Engine
 *
 * Formula: KEA Official Merit Calculation
 * Reference: https://cetonline.karnataka.gov.in/kea/
 *
 * Step 1: KCET% = (Physics + Chemistry + Maths in KCET) / 180 × 100
 * Step 2: Board PCM% = (P + C + M in Board) / 300 × 100
 * Step 3: Aggregate = (KCET% + Board PCM%) / 2
 * Step 4: Rank = position in descending order of Aggregate
 *
 * Rank table calibrated from 2026 KCET data (261,779 candidates)
 * Data source: KCET 2026 Rank vs Aggregate cleaned dataset
 *
 * Key 2026 insight: ~25% more candidates than 2025, significantly harder
 * at every score band especially 90–95% range (+145% rank inflation)
 */

import { RankPrediction } from '@/types'
import { SCORE_TO_RANK_2026 } from './constants'

/**
 * Linear interpolation between two known data points
 * Returns precise rank for a given score
 */
function interpolateRank(score: number): { low: number; high: number } {
  const table = SCORE_TO_RANK_2026

  // Above highest threshold
  if (score >= table[0][0]) return { low: 1, high: table[0][2] }

  // Below lowest threshold
  if (score < table[table.length - 1][0]) {
    return { low: table[table.length - 1][1], high: 281779 }
  }

  // Find bracket
  for (let i = 0; i < table.length - 1; i++) {
    const [scoreHigh, rankLow] = table[i]
    const [scoreLow, , rankHigh] = table[i + 1]

    if (score >= scoreLow && score < scoreHigh) {
      // Interpolate within bracket
      const t = (scoreHigh - score) / (scoreHigh - scoreLow)
      const midRank = Math.round(rankLow + t * (rankHigh - rankLow))

      // Return a band of ±8% around interpolated rank for realism
      const margin = Math.max(200, Math.round(midRank * 0.08))
      return {
        low: Math.max(1, midRank - margin),
        high: midRank + margin,
      }
    }
  }

  return { low: 150000, high: 200000 }
}

export function predictRank(
  physicsCET: number,
  chemistryCET: number,
  mathsCET: number,
  boardPCMTotal: number // out of 300
): RankPrediction {
  const cetTotal = physicsCET + chemistryCET + mathsCET
  const cetPercent = (cetTotal / 180) * 100
  const boardPercent = (boardPCMTotal / 300) * 100
  const compositeScore = (cetPercent + boardPercent) / 2

  const { low, high } = interpolateRank(compositeScore)

  // Confidence based on score range
  // High scores have more precise data, low scores have more variance
  const confidence: 'High' | 'Medium' | 'Low' =
    compositeScore >= 75 ? 'High' : compositeScore >= 55 ? 'Medium' : 'Low'

  return {
    low,
    high,
    confidence,
    compositeScore: Math.round(compositeScore * 100) / 100,
  }
}

export function formatRank(rank: number): string {
  if (rank >= 100000) return `${(rank / 100000).toFixed(1)}L`
  if (rank >= 1000) return `${(rank / 1000).toFixed(1)}K`
  return rank.toString()
}

export function formatRankFull(rank: number): string {
  return rank.toLocaleString('en-IN')
}

/**
 * 2025 vs 2026 comparison data for display
 * Shows how much harder 2026 is at each aggregate band
 */
export const YEAR_COMPARISON: { aggregate: number; rank2025: number; rank2026: number }[] = [
  { aggregate: 94, rank2025: 435, rank2026: 580 },
  { aggregate: 92, rank2025: 715, rank2026: 1150 },
  { aggregate: 90, rank2025: 1245, rank2026: 1900 },
  { aggregate: 88, rank2025: 1860, rank2026: 3500 },
  { aggregate: 86, rank2025: 2801, rank2026: 4727 },
  { aggregate: 84, rank2025: 4043, rank2026: 6541 },
  { aggregate: 82, rank2025: 6406, rank2026: 9801 },
  { aggregate: 80, rank2025: 8377, rank2026: 12953 },
  { aggregate: 78, rank2025: 10616, rank2026: 15765 },
  { aggregate: 76, rank2025: 14341, rank2026: 21009 },
  { aggregate: 74, rank2025: 18405, rank2026: 26073 },
  { aggregate: 72, rank2025: 23152, rank2026: 33381 },
  { aggregate: 70, rank2025: 30454, rank2026: 41007 },
  { aggregate: 68, rank2025: 37259, rank2026: 50780 },
  { aggregate: 66, rank2025: 45282, rank2026: 62273 },
  { aggregate: 64, rank2025: 54882, rank2026: 76285 },
  { aggregate: 62, rank2025: 66061, rank2026: 92110 },
  { aggregate: 60, rank2025: 79060, rank2026: 109771 },
]
