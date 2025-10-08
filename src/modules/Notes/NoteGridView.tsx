"use client";

import { NoteWithCategory } from "@/types/database";
import { Edit, Trash2 } from "lucide-react";

interface NoteGridViewProps {
  notes: NoteWithCategory[];
  onViewNote: (note: NoteWithCategory) => void;
  onEditNote: (note: NoteWithCategory) => void;
  onDeleteNote: (note: NoteWithCategory) => void;
  formatDate: (dateString: string) => string;
  stripHtml: (html: string) => string;
}

export const NoteGridView = ({
  notes,
  onViewNote,
  onEditNote,
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
          <div className="flex items-center gap-2 mb-3">
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
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {note.heading}
          </h4>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {stripHtml(note.content)}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatDate(note.lastUpdatedDate)}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditNote(note);
                }}
                className="p-1 text-gray-400 hover:text-blue-600"
                title="Edit note"
              >
                <Edit className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note);
                }}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Delete note"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
