"use client";

import { NoteWithCategory } from "@/types/database";
import { Calendar, Edit, Trash2, User } from "lucide-react";

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
  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onViewNote(note)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
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
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
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
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditNote(note);
                }}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit note"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note);
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
