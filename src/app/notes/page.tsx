"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import DeleteModal from "@/components/molecules/DeleteModal";
import Drawer from "@/components/molecules/Drawer";
import { Header } from "@/components/organisms/Header/Header";
import { useAuth } from "@/lib/auth-context";
import { NoteForm } from "@/modules/Notes/NoteForm";
import { Note, NoteCategory, NoteInsert } from "@/types/database";
import {
  Calendar,
  Edit,
  FileText,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type ViewMode = "list" | "grid";

interface User {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  addedOn: string;
  lastUpdated: string;
  addedBy: string | null;
  updatedBy: string | null;
}

interface NoteWithCategory extends Note {
  note_categories: NoteCategory;
}

export default function NotesPage() {
  const {
    user,
    loading: authLoading,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    fetchNoteCategories,
    fetchAllUsers,
  } = useAuth();
  const router = useRouter();

  const [notes, setNotes] = useState<NoteWithCategory[]>([]);
  const [categories, setCategories] = useState<NoteCategory[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteWithCategory | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<NoteWithCategory | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Load notes and categories on component mount
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [notesResult, categoriesResult, usersResult] = await Promise.all([
        fetchNotes(),
        fetchNoteCategories(),
        fetchAllUsers(),
      ]);

      if (notesResult.error) {
        throw notesResult.error;
      }

      if (categoriesResult.error) {
        throw categoriesResult.error;
      }

      if (usersResult.error) {
        throw usersResult.error;
      }

      setNotes((notesResult.data as NoteWithCategory[]) || []);
      setCategories(categoriesResult.data || []);
      setUsers(usersResult.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [fetchNotes, fetchNoteCategories, fetchAllUsers]);

  const handleAddNote = useCallback(() => {
    setEditingNote(null);
    setIsDrawerOpen(true);
  }, []);

  const handleEditNote = useCallback((note: NoteWithCategory) => {
    setEditingNote(note);
    setIsDrawerOpen(true);
  }, []);

  const handleDeleteNote = useCallback((note: NoteWithCategory) => {
    setNoteToDelete(note);
    setDeleteModalOpen(true);
  }, []);

  const handleSubmitNote = useCallback(
    async (
      data: Omit<
        Note,
        "id" | "lastUpdatedBy" | "lastUpdatedDate" | "createdAt" | "updatedAt"
      >
    ) => {
      try {
        setIsSubmitting(true);
        setError(null);

        let result;
        if (editingNote) {
          result = await updateNote(editingNote.id, data);
        } else {
          result = await createNote(data as NoteInsert);
        }

        if (result.error) {
          throw result.error;
        }

        // Update local state instead of refetching
        if (editingNote) {
          setNotes((prev) =>
            prev.map((note) =>
              note.id === editingNote.id
                ? { ...note, ...data, updatedAt: new Date().toISOString() }
                : note
            )
          );
        } else {
          if (result.data) {
            setNotes((prev) => [...prev, result.data as NoteWithCategory]);
          }
        }

        setIsDrawerOpen(false);
        setEditingNote(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save note");
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingNote, createNote, updateNote]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!noteToDelete) return;

    try {
      setError(null);
      const { error } = await deleteNote(noteToDelete.id);

      if (error) {
        throw error;
      }

      setNotes((prev) => prev.filter((note) => note.id !== noteToDelete.id));

      setDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note");
    }
  }, [noteToDelete, deleteNote]);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setEditingNote(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setNoteToDelete(null);
  }, []);

  // Filter notes based on search query and category
  const filteredNotes = notes
    .filter((note) => {
      // Search filter
      const matchesSearch =
        note.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.note_categories?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || note.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort(
      (a, b) =>
        new Date(b.lastUpdatedDate).getTime() -
        new Date(a.lastUpdatedDate).getTime()
    );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getUserName = (userId: string) => {
    const foundUser = users.find((u) => u.id === userId);
    return foundUser?.name || "Unknown User";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
            <p className="text-gray-600 mt-2">
              Create and manage your personal notes
            </p>
          </div>
          <Button
            onClick={handleAddNote}
            leftIcon={<Plus className="h-4 w-4" />}
            className="shrink-0"
          >
            Add Note
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex-1 max-w-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
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

        {/* Notes List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Notes ({filteredNotes.length})
            </h3>
            <div className="text-sm text-gray-500">
              {searchQuery && <span>Search: &ldquo;{searchQuery}&rdquo;</span>}
              {selectedCategory !== "all" && (
                <span className={searchQuery ? " ml-2" : ""}>
                  {searchQuery ? "• " : ""}Category:{" "}
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              )}
            </div>
          </div>

          {/* Empty State */}
          {filteredNotes.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || selectedCategory !== "all"
                  ? "No notes found"
                  : "No notes yet"}
              </h4>
              <p className="text-gray-500 mb-4">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search terms or category filter"
                  : "Get started by creating your first note."}
              </p>
              {!searchQuery && selectedCategory === "all" && (
                <Button
                  onClick={handleAddNote}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Note
                </Button>
              )}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && filteredNotes.length > 0 && (
            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
                          <span>
                            Updated {formatDate(note.lastUpdatedDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>By {getUserName(note.lastUpdatedBy)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit note"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note)}
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
          )}

          {/* Grid View */}
          {viewMode === "grid" && filteredNotes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
                        onClick={() => handleEditNote(note)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Edit note"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note)}
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
          )}
        </Card>

        {/* Add/Edit Note Drawer */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          title={editingNote ? "Edit Note" : "Add New Note"}
          description={
            editingNote
              ? "Update your note content"
              : "Create a new note with rich text formatting"
          }
          side="right"
        >
          <NoteForm
            onSubmit={handleSubmitNote}
            onCancel={handleCloseDrawer}
            loading={isSubmitting}
            initialData={editingNote || undefined}
            categories={categories}
          />
        </Drawer>

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          title="Delete Note"
          description={`Are you sure you want to delete "${noteToDelete?.heading}"? This action cannot be undone.`}
        >
          <DeleteModal.Action
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
          />
        </DeleteModal>
      </div>
    </div>
  );
}
