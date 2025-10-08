"use client";

import { Card } from "@/components/atoms/Card";
import DeleteModal from "@/components/molecules/DeleteModal";
import Drawer from "@/components/molecules/Drawer";
import { Pagination } from "@/components/molecules/Pagination";
import { Header } from "@/components/organisms/Header/Header";
import { useAuth } from "@/lib/auth-context";
import { EmptyState } from "@/modules/Notes/EmptyState";
import { NoteDetailDrawer } from "@/modules/Notes/NoteDetailDrawer";
import { NoteForm } from "@/modules/Notes/NoteForm";
import { NoteGridView } from "@/modules/Notes/NoteGridView";
import { NoteListView } from "@/modules/Notes/NoteListView";
import { NotesFilters } from "@/modules/Notes/NotesFilters";
import { NotesHeader } from "@/modules/Notes/NotesHeader";
import {
  filterNotes,
  formatDate,
  getUserName,
  paginateNotes,
  stripHtml,
} from "@/modules/Notes/noteUtils";
import { Note, NoteCategory } from "@/types/database";
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
  const [noteDetailOpen, setNoteDetailOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteWithCategory | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

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

  // Load notes and categories on component mount
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

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

  const handleFormSuccess = useCallback(() => {
    setIsDrawerOpen(false);
    setEditingNote(null);
    setCurrentPage(1); // Reset to first page after creating/updating
    // Reload data to get the latest notes
    loadData();
  }, [loadData]);

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
      setCurrentPage(1); // Reset to first page after deletion
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

  const handleViewNote = useCallback((note: NoteWithCategory) => {
    setSelectedNote(note);
    setNoteDetailOpen(true);
  }, []);

  const handleCloseNoteDetail = useCallback(() => {
    setNoteDetailOpen(false);
    setSelectedNote(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Filter notes based on search query and category
  const filteredNotes = filterNotes(notes, searchQuery, selectedCategory);

  // Paginate the filtered notes
  const { paginatedNotes, totalPages, totalItems } = paginateNotes(
    filteredNotes,
    currentPage,
    itemsPerPage
  );

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
        <NotesHeader onAddNote={handleAddNote} />

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

        <NotesFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Notes List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Notes ({totalItems})
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
          {paginatedNotes.length === 0 && !loading && (
            <EmptyState
              hasFilters={!!(searchQuery || selectedCategory !== "all")}
              onAddNote={handleAddNote}
            />
          )}

          {/* List View */}
          {viewMode === "list" && paginatedNotes.length > 0 && (
            <NoteListView
              notes={paginatedNotes}
              onViewNote={handleViewNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              getUserName={(userId) => getUserName(userId, users)}
              formatDate={formatDate}
              stripHtml={stripHtml}
            />
          )}

          {/* Grid View */}
          {viewMode === "grid" && paginatedNotes.length > 0 && (
            <NoteGridView
              notes={paginatedNotes}
              onViewNote={handleViewNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              formatDate={formatDate}
              stripHtml={stripHtml}
            />
          )}
        </Card>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

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
            onCancel={handleCloseDrawer}
            onSuccess={handleFormSuccess}
            initialData={editingNote || undefined}
            categories={categories}
            createNote={createNote}
            updateNote={updateNote}
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

        {/* Note Detail Drawer */}
        <NoteDetailDrawer
          isOpen={noteDetailOpen}
          onClose={handleCloseNoteDetail}
          selectedNote={selectedNote}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
          getUserName={(userId) => getUserName(userId, users)}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
}
