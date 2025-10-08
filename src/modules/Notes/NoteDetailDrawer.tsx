"use client";

import Drawer from "@/components/molecules/Drawer";
import { NoteWithCategory } from "@/types/database";
import { Calendar, Edit, Trash2, User } from "lucide-react";

interface NoteDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNote: NoteWithCategory | null;
  onEdit: (note: NoteWithCategory) => void;
  onDelete: (note: NoteWithCategory) => void;
  getUserName: (userId: string) => string;
  formatDate: (dateString: string) => string;
}

export const NoteDetailDrawer = ({
  isOpen,
  onClose,
  selectedNote,
  onEdit,
  onDelete,
  getUserName,
  formatDate,
}: NoteDetailDrawerProps) => {
  const handleEdit = () => {
    if (selectedNote) {
      onClose();
      onEdit(selectedNote);
    }
  };

  const handleDelete = () => {
    if (selectedNote) {
      onClose();
      onDelete(selectedNote);
    }
  };

  const getDescription = () => {
    return (
      <span
        className="px-3 py-1 text-sm rounded-full font-medium"
        style={{
          backgroundColor: selectedNote?.note_categories?.color + "20",
          color: selectedNote?.note_categories?.color ?? "gray",
        }}
      >
        {selectedNote?.note_categories?.name}
      </span>
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={selectedNote?.heading || "Note Details"}
      description={""}
      side="right"
    >
      {selectedNote && (
        <div className="space-y-6">
          {/* Note Metadata */}
          <div className="border-t pt-4 flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-gray-500">
              {getDescription()}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedNote.lastUpdatedDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{getUserName(selectedNote.lastUpdatedBy)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit note"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Note Content */}
          <div className="prose prose-sm max-w-none">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedNote.content }}
            />
          </div>
        </div>
      )}
    </Drawer>
  );
};
