"use client";

import { Button } from "@/components/atoms/Button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  // Don't show pagination if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  const handleFirstPage = () => onPageChange(1);
  const handlePreviousPage = () => onPageChange(currentPage - 1);
  const handleNextPage = () => onPageChange(currentPage + 1);
  const handleLastPage = () => onPageChange(totalPages);

  // Generate page numbers to display
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5; // Show max 5 page numbers

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      // Always show first page
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("...");
        }
      }

      // Show pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Always show last page
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-6">
      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2">
        {/* First Page Button */}
        <Button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          leftIcon={<ChevronsLeft className="h-4 w-4" />}
          className="px-3"
          title="Go to first page"
        >
          First
        </Button>

        {/* Previous Page Button */}
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          leftIcon={<ChevronLeft className="h-4 w-4" />}
          className="px-3"
          title="Go to previous page"
        >
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={typeof page !== "number"}
              className={`relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                page === currentPage
                  ? "bg-blue-600 text-white shadow-md"
                  : page === "..."
                  ? "text-gray-400 cursor-default"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
              title={
                typeof page === "number" ? `Go to page ${page}` : undefined
              }
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Page Button */}
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          rightIcon={<ChevronRight className="h-4 w-4" />}
          className="px-3"
          title="Go to next page"
        >
          Next
        </Button>

        {/* Last Page Button */}
        <Button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          rightIcon={<ChevronsRight className="h-4 w-4" />}
          className="px-3"
          title="Go to last page"
        >
          Last
        </Button>
      </div>
    </div>
  );
};
