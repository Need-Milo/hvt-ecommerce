"use client"

import React from "react"

interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: Props) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border disabled:opacity-40 hover:bg-gray-100"
      >
        Trước
      </button>
      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md border transition
                ${
                  isActive
                    ? "bg-shop-dark-green text-white border-shop-dark-green"
                    : "hover:bg-gray-100"
                }
              `}
          >
            {page}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md border disabled:opacity-40 hover:bg-gray-100"
      >
        Sau
      </button>
    </div>
  );
}

export default Pagination