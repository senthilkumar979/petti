"use client";

import { Button } from "@/components/atoms/Button";
import { Plus } from "lucide-react";

interface NotesHeaderProps {
  onAddNote: () => void;
}

export const NotesHeader = ({ onAddNote }: NotesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
        <p className="text-gray-600 mt-2">
          Create and manage your personal notes
        </p>
      </div>
      <Button
        onClick={onAddNote}
        leftIcon={<Plus className="h-4 w-4" />}
        className="shrink-0"
      >
        Add Note
      </Button>
    </div>
  );
};
