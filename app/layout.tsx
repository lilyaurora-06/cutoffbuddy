import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'CutoffBuddy – KCET College & Rank Predictor',
  description:
    'Predict your KCET rank, find colleges based on your rank, explore previous year cutoffs for all Karnataka engineering colleges. Free tool for KCET 2025 counselling.',
  keywords: 'KCET rank predictor, KCET college predictor, Karnataka engineering cutoff, KEA counselling, KCET 2025',
  openGraph: {
    title: 'CutoffBuddy – KCET College & Rank Predictor',
    description: 'Free KCET rank predictor and college finder for Karnataka students',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
