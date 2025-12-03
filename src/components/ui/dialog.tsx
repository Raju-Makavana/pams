import * as React from "react"

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export function DialogContent({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-white via-purple-100 to-pink-100 border border-purple-200 rounded-lg shadow-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}

export function DialogHeader({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <h2 className={`text-2xl font-bold text-foreground ${className}`}>
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <p className={`text-muted-foreground mt-2 text-sm ${className}`}>
      {children}
    </p>
  )
}
