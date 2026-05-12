export interface CutoffRecord {
  college_code: string
  college_name: string
  branch_code: string
  branch_name: string
  category: string
  year: number
  round: string
  closing_rank: number
}

export interface College {
  code: string
  name: string
}

export interface Branch {
  code: string
  name: string
}

export interface RankPrediction {
  low: number
  high: number
  confidence: 'High' | 'Medium' | 'Low'
  compositeScore: number
}

export interface CollegePrediction {
  college_code: string
  college_name: string
  branch_code: string
  branch_name: string
  closing_rank: number
  probability: 'Safe' | 'Moderate' | 'Ambitious'
  year: number
  round: string
}

export type Category =
  | '1G' | '1K' | '1R'
  | '2AG' | '2AK' | '2AR'
  | '2BG' | '2BK' | '2BR'
  | '3AG' | '3AK' | '3AR'
  | '3BG' | '3BK' | '3BR'
  | 'GM' | 'GMK' | 'GMR'
  | 'SCG' | 'SCK' | 'SCR'
  | 'STG' | 'STK' | 'STR'
