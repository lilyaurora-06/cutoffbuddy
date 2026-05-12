export const CATEGORIES = [
  { value: 'GM', label: 'GM – General Merit' },
  { value: 'GMK', label: 'GMK – General Merit (Kannada Medium)' },
  { value: 'GMR', label: 'GMR – General Merit (Rural)' },
  { value: '1G', label: '1G – Category 1 (General)' },
  { value: '1K', label: '1K – Category 1 (Kannada Medium)' },
  { value: '1R', label: '1R – Category 1 (Rural)' },
  { value: '2AG', label: '2AG – Category 2A (General)' },
  { value: '2AK', label: '2AK – Category 2A (Kannada Medium)' },
  { value: '2AR', label: '2AR – Category 2A (Rural)' },
  { value: '2BG', label: '2BG – Category 2B (General)' },
  { value: '2BK', label: '2BK – Category 2B (Kannada Medium)' },
  { value: '2BR', label: '2BR – Category 2B (Rural)' },
  { value: '3AG', label: '3AG – Category 3A (General)' },
  { value: '3AK', label: '3AK – Category 3A (Kannada Medium)' },
  { value: '3AR', label: '3AR – Category 3A (Rural)' },
  { value: '3BG', label: '3BG – Category 3B (General)' },
  { value: '3BK', label: '3BK – Category 3B (Kannada Medium)' },
  { value: '3BR', label: '3BR – Category 3B (Rural)' },
  { value: 'SCG', label: 'SCG – Scheduled Caste (General)' },
  { value: 'SCK', label: 'SCK – Scheduled Caste (Kannada Medium)' },
  { value: 'SCR', label: 'SCR – Scheduled Caste (Rural)' },
  { value: 'STG', label: 'STG – Scheduled Tribe (General)' },
  { value: 'STK', label: 'STK – Scheduled Tribe (Kannada Medium)' },
  { value: 'STR', label: 'STR – Scheduled Tribe (Rural)' },
]

export const YEARS = [2025, 2024, 2023]

export const ROUNDS = ['Round 1', 'Round 2', 'Round 3', 'Extended Round']

export const POPULAR_BRANCHES = [
  'Computer Science & Engg',
  'Electronics & Communication Engg',
  'Electrical & Electronics Engg',
  'Mechanical Engg',
  'Civil Engg',
  'Information Science & Engg',
  'AI & Data Science',
  'Artificial Intelligence & ML',
]

// Rank prediction score→rank calibration table
// Based on KEA merit formula: (PUC% + KCET%) / 2
// Calibrated from 2023-2025 data patterns
export const SCORE_TO_RANK: [number, number, number][] = [
  // [score, rankLow, rankHigh]
  [98, 1, 50],
  [96, 50, 200],
  [94, 200, 500],
  [92, 500, 1000],
  [90, 1000, 2000],
  [88, 2000, 3500],
  [86, 3500, 5500],
  [84, 5500, 8000],
  [82, 8000, 11000],
  [80, 11000, 15000],
  [78, 15000, 20000],
  [75, 20000, 28000],
  [72, 28000, 38000],
  [69, 38000, 50000],
  [66, 50000, 65000],
  [63, 65000, 82000],
  [60, 82000, 100000],
  [57, 100000, 125000],
  [54, 125000, 155000],
  [50, 155000, 190000],
  [45, 190000, 230000],
  [40, 230000, 275000],
  [0, 275000, 300000],
]
