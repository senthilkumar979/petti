"use client";

import Drawer from "@/components/molecules/Drawer";
import { NoteWithCategory } from "@/types/database";
import { Calendar, User } from "lucide-react";
import { EditDeleteActions } from "../../components/templates/EditDeleteActions";
import { useMediaQuery } from "../../hooks/useMediaQuery";

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
  const { isMobile } = useMediaQuery();
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

  const getCategory = () => {
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
            <div className="flex sm:flex-row flex-col flex-row-reverse items-center gap-6 text-sm text-gray-500">
              <div className="hidden md:block ">{getCategory()}</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedNote.lastUpdatedDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{getUserName(selectedNote.lastUpdatedBy)}</span>
                </div>
              </div>
              {isMobile && getCategory()}
            </div>
            <EditDeleteActions
              onEdit={() => onEdit(selectedNote)}
              onDelete={() => onDelete(selectedNote)}
            />
          </div>

          {/* Note Content */}
          <div className="prose prose-sm max-w-none">
            <div
              className="text-gray-700 leading-relaxed border p-4 font-size-sm border-gray-200 rounded-lg"
              dangerouslySetInnerHTML={{ __html: selectedNote.content }}
            />
          </div>
        </div>
      )}
    </Drawer>
  );
};
