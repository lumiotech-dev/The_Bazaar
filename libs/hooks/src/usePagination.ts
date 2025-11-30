import { useState, useMemo } from 'react'

interface UsePaginationReturn {
  currentPage: number
  pageSize: number
  totalPages: number
  startIndex: number
  endIndex: number
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
}

/**
 * Hook for managing pagination state
 */
export function usePagination(totalItems: number, pageSize: number = 10): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(totalItems / pageSize)

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }

  const nextPage = () => goToPage(currentPage + 1)
  const prevPage = () => goToPage(currentPage - 1)

  return useMemo(
    () => ({
      currentPage,
      pageSize,
      totalPages,
      startIndex,
      endIndex,
      goToPage,
      nextPage,
      prevPage,
    }),
    [currentPage, pageSize, totalPages, startIndex, endIndex]
  )
}
