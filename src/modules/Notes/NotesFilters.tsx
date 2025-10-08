"use client";

import { Input } from "@/components/atoms/Input";
import { NoteCategory } from "@/types/database";
import { FileText, Search } from "lucide-react";

type ViewMode = "list" | "grid";

interface NotesFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: NoteCategory[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const NotesFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  viewMode,
  onViewModeChange,
}: NotesFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex-1 max-w-xs">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewModeChange("list")}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === "list"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <FileText className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === "grid"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <div className="grid grid-cols-2 gap-0.5 h-4 w-4">
            <div className="bg-current rounded-sm"></div>
            <div className="bg-current rounded-sm"></div>
            <div className="bg-current rounded-sm"></div>
            <div className="bg-current rounded-sm"></div>
          </div>
        </button>
      </div>
    </div>
  );
};
