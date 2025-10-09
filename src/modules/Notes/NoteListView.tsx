"use client";

import { NoteWithCategory } from "@/types/database";
import { Calendar, User } from "lucide-react";
import { EditDeleteActions } from "../../components/templates/EditDeleteActions";
import { useMediaQuery } from "../../hooks/useMediaQuery";

interface NoteListViewProps {
  notes: NoteWithCategory[];
  onViewNote: (note: NoteWithCategory) => void;
  onEditNote: (note: NoteWithCategory) => void;
  onDeleteNote: (note: NoteWithCategory) => void;
  getUserName: (userId: string) => string;
  formatDate: (dateString: string) => string;
  stripHtml: (html: string) => string;
}

export const NoteListView = ({
  notes,
  onViewNote,
  onEditNote,
  onDeleteNote,
  getUserName,
  formatDate,
  stripHtml,
}: NoteListViewProps) => {
  const { isMobile } = useMediaQuery();
  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onViewNote(note)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 gap-4">
              <div className="flex sm:flex-row flex-col items-center gap-3 mb-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  {note.heading}
                </h4>
                <span
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: note.note_categories?.color + "20",
                    color: note.note_categories?.color ?? "gray",
                  }}
                >
                  {note.note_categories?.name}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 ">
                {stripHtml(note.content)}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Updated {formatDate(note.lastUpdatedDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>By {getUserName(note.lastUpdatedBy)}</span>
                </div>
              </div>
              {isMobile && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <EditDeleteActions
                    onEdit={() => onEditNote(note)}
                    onDelete={() => onDeleteNote(note)}
                  />
                </div>
              )}
            </div>
            {!isMobile && (
              <div className="flexitems-center gap-2">
                <EditDeleteActions
                  onEdit={() => onEditNote(note)}
                  onDelete={() => onDeleteNote(note)}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
