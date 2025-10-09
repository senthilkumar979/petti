"use client";

import { Input } from "@/components/atoms/Input";
import { Grid3X3, List, Search, Table2, Users } from "lucide-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

type ViewMode = "list" | "grid" | "table";

interface ContactsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ContactsFilters = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: ContactsFiltersProps) => {
  const { isMobile, isTablet } = useMediaQuery();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search contacts..."
          className="pl-10"
        />
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center gap-2 justify-end">
        {!isMobile && !isTablet && (
          <button
            onClick={() => onViewModeChange("table")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "table"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title="Table view"
          >
            <Table2 className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => onViewModeChange("list")}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === "list"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
          title="List view"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === "grid"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
          title="Grid view"
        >
          <Grid3X3 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
