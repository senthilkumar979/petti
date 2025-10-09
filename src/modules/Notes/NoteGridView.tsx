"use client";

import { NoteWithCategory } from "@/types/database";
import { Calendar, User } from "lucide-react";
import { EditDeleteActions } from "../../components/templates/EditDeleteActions";

interface NoteGridViewProps {
  notes: NoteWithCategory[];
  onViewNote: (note: NoteWithCategory) => void;
  onEditNote: (note: NoteWithCategory) => void;
  onDeleteNote: (note: NoteWithCategory) => void;
  getUserName: (userId: string) => string;
  formatDate: (dateString: string) => string;
  stripHtml: (html: string) => string;
}

export const NoteGridView = ({
  notes,
  onViewNote,
  onEditNote,
  getUserName,
  onDeleteNote,
  formatDate,
  stripHtml,
}: NoteGridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <div
          key={note.id}
          className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onViewNote(note)}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: note.note_categories?.color + "20",
                color: note.note_categories?.color ?? "gray",
              }}
            >
              {note.note_categories?.name}
            </span>
            <EditDeleteActions
              onEdit={() => onEditNote(note)}
              onDelete={() => onDeleteNote(note)}
            />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {note.heading}
          </h4>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 border-t pt-4">
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
        </div>
      ))}
    </div>
  );
};
