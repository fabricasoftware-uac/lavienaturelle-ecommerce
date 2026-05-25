"use client"

import { useRef, useEffect, type ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface InfiniteScrollProps {
  children?: ReactNode
  loadMore: () => void
  hasMore: boolean
  loader?: ReactNode
  className?: string
}

export function InfiniteScroll({ children, loadMore, hasMore, loader, className }: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore, hasMore])

  return (
    <div className={className}>
      {children}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-6">
          {loader || <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
        </div>
      )}
    </div>
  )
}
