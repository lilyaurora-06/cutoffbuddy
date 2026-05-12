/**
 * KCET Rank Prediction Logic
 *
 * Formula Source: KEA Official Merit Calculation
 * Reference: https://cetonline.karnataka.gov.in/kea/
 *
 * KEA Merit Score = (PUC_PCM_Percentage + KCET_Percentage) / 2
 * Where:
 *   PUC_PCM_Percentage = (Physics + Chemistry + Maths marks in PUC) / 300 * 100
 *   KCET_Percentage    = (Physics + Chemistry + Maths in KCET) / 180 * 100
 *
 * Students are ranked in descending order of merit score.
 * Ties broken by: KCET marks > PUC marks > Age (older = higher rank)
 *
 * Rank ranges calibrated from 2023–2025 historical data.
 */

import { RankPrediction } from '@/types'
import { SCORE_TO_RANK } from './constants'

export function predictRank(
  physicsCET: number,
  chemistryCET: number,
  mathsCET: number,
  boardPCMTotal: number // out of 300
): RankPrediction {
  const cetTotal = physicsCET + chemistryCET + mathsCET // out of 180
  const cetPercent = (cetTotal / 180) * 100
  const boardPercent = (boardPCMTotal / 300) * 100
  const compositeScore = (cetPercent + boardPercent) / 2

  // Find rank range from calibration table
  let rankLow = 275000
  let rankHigh = 300000

  for (const [score, low, high] of SCORE_TO_RANK) {
    if (compositeScore >= score) {
      rankLow = low
      rankHigh = high
      break
    }
  }

  // Widen range slightly for low scores (more uncertainty)
  const confidence: 'High' | 'Medium' | 'Low' =
    compositeScore >= 80 ? 'High' : compositeScore >= 60 ? 'Medium' : 'Low'

  if (confidence === 'Low') {
    rankHigh = Math.round(rankHigh * 1.15)
  }

  return {
    low: rankLow,
    high: rankHigh,
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
