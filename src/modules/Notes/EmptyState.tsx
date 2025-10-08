"use client";

import { Button } from "@/components/atoms/Button";
import { FileText, Plus } from "lucide-react";

interface EmptyStateProps {
  hasFilters: boolean;
  onAddNote: () => void;
}

export const EmptyState = ({ hasFilters, onAddNote }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-gray-400" />
      </div>
      <h4 className="text-lg font-medium text-gray-900 mb-2">
        {hasFilters ? "No notes found" : "No notes yet"}
      </h4>
      <p className="text-gray-500 mb-4">
        {hasFilters
          ? "Try adjusting your search terms or category filter"
          : "Get started by creating your first note."}
      </p>
      {!hasFilters && (
        <Button onClick={onAddNote} leftIcon={<Plus className="h-4 w-4" />}>
          Add Note
        </Button>
      )}
    </div>
  );
};
