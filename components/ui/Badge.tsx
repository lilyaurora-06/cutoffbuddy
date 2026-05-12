import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'safe' | 'moderate' | 'ambitious' | 'blue' | 'gray' | 'green'
  className?: string
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  const variants = {
    safe: 'bg-green-100 text-green-700 border border-green-200',
    moderate: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    ambitious: 'bg-red-100 text-red-700 border border-red-200',
    blue: 'bg-blue-100 text-blue-700 border border-blue-200',
    gray: 'bg-slate-100 text-slate-600 border border-slate-200',
    green: 'bg-green-100 text-green-700 border border-green-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
