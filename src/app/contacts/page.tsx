"use client";

import { Card } from "@/components/atoms/Card";
import DeleteModal from "@/components/molecules/DeleteModal";
import Drawer from "@/components/molecules/Drawer";
import { Header } from "@/components/organisms/Header/Header";
import { useAuth } from "@/lib/auth-context";
import { ContactDetails } from "@/modules/Contacts/ContactDetails";
import { ContactForm } from "@/modules/Contacts/ContactForm";
import { ContactGridView } from "@/modules/Contacts/ContactGridView";
import { ContactListView } from "@/modules/Contacts/ContactListView";
import { ContactTableView } from "@/modules/Contacts/ContactTableView";
import { ContactsEmptyState } from "@/modules/Contacts/ContactsEmptyState";
import { ContactsFilters } from "@/modules/Contacts/ContactsFilters";
import { ContactsHeader } from "@/modules/Contacts/ContactsHeader";
import { filterContacts, formatDate } from "@/modules/Contacts/contactUtils";
import { Contact, ContactInsert } from "@/types/database";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type ViewMode = "list" | "grid" | "table";

export default function ContactsPage() {
  const {
    user,
    loading: authLoading,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  } = useAuth();
  const router = useRouter();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchContacts();
      if (result.error) {
        throw result.error;
      }

      setContacts(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [fetchContacts]);

  // Load contacts on component mount
  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user, loadContacts]);

  const handleAddContact = useCallback(() => {
    setEditingContact(null);
    setViewingContact(null);
    setIsDrawerOpen(true);
  }, []);

  const handleViewContact = useCallback((contact: Contact) => {
    setViewingContact(contact);
    setEditingContact(null);
    setIsDrawerOpen(true);
  }, []);

  const handleEditContact = useCallback((contact: Contact) => {
    setEditingContact(contact);
    setViewingContact(null);
    setIsDrawerOpen(true);
  }, []);

  const handleDeleteContact = useCallback((contact: Contact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  }, []);

  const handleSubmitContact = useCallback(
    async (
      data: Omit<ContactInsert, "id" | "ownedBy" | "createdAt" | "updatedAt">
    ) => {
      try {
        setIsSubmitting(true);
        setError(null);

        let result;
        if (editingContact) {
          result = await updateContact(editingContact.id, data);
        } else {
          result = await createContact({
            ...data,
            ownedBy: user?.id || "",
          });
        }

        if (result.error) {
          throw result.error;
        }

        // Update local state instead of refetching
        if (editingContact) {
          setContacts((prev) =>
            prev.map((contact) =>
              contact.id === editingContact.id
                ? { ...contact, ...data, updatedAt: new Date().toISOString() }
                : contact
            )
          );
        } else {
          if (result.data) {
            setContacts((prev) => [...prev, result.data as Contact]);
          }
        }

        setIsDrawerOpen(false);
        setEditingContact(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save contact");
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingContact, createContact, updateContact, user?.id]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!contactToDelete) return;

    try {
      setError(null);
      const { error } = await deleteContact(contactToDelete.id);

      if (error) {
        throw error;
      }

      setContacts((prev) =>
        prev.filter((contact) => contact.id !== contactToDelete.id)
      );

      setDeleteModalOpen(false);
      setContactToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete contact");
    }
  }, [contactToDelete, deleteContact]);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setEditingContact(null);
    setViewingContact(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setContactToDelete(null);
  }, []);

  // Filter contacts based on search query
  const filteredContacts = filterContacts(contacts, searchQuery);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
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
        <ContactsHeader onAddContact={handleAddContact} />

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

        <ContactsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Contacts List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Contacts ({filteredContacts.length})
            </h3>
            {searchQuery && (
              <p className="text-sm text-gray-500">
                Showing results for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>

          {/* Empty State */}
          {filteredContacts.length === 0 && !loading && (
            <ContactsEmptyState
              hasFilters={!!searchQuery}
              onAddContact={handleAddContact}
            />
          )}

          {/* List View */}
          {viewMode === "list" && filteredContacts.length > 0 && (
            <ContactListView
              contacts={filteredContacts}
              onViewContact={handleViewContact}
              onEditContact={handleEditContact}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {/* Grid View */}
          {viewMode === "grid" && filteredContacts.length > 0 && (
            <ContactGridView
              contacts={filteredContacts}
              onViewContact={handleViewContact}
              onEditContact={handleEditContact}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {/* Table View */}
          {viewMode === "table" && filteredContacts.length > 0 && (
            <ContactTableView
              contacts={filteredContacts}
              onViewContact={handleViewContact}
              onEditContact={handleEditContact}
              onDeleteContact={handleDeleteContact}
              formatDate={formatDate}
            />
          )}
        </Card>

        {/* Add/Edit Contact Drawer */}
        <Drawer
          isOpen={
            isDrawerOpen &&
            (editingContact !== null || (!editingContact && !viewingContact))
          }
          onClose={handleCloseDrawer}
          title={editingContact ? "Edit Contact" : "Add New Contact"}
          description={
            editingContact
              ? "Update contact information"
              : "Fill in the details to add a new contact"
          }
          side="right"
        >
          <ContactForm
            onSubmit={handleSubmitContact}
            onCancel={handleCloseDrawer}
            loading={isSubmitting}
            initialData={editingContact || undefined}
          />
        </Drawer>

        {/* View Contact Drawer */}
        <Drawer
          isOpen={isDrawerOpen && viewingContact !== null}
          onClose={handleCloseDrawer}
          title="Contact Details"
          description="View contact information"
          side="right"
        >
          {viewingContact && (
            <ContactDetails
              contact={viewingContact}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          )}
        </Drawer>

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          title="Delete Contact"
          description={`Are you sure you want to delete "${contactToDelete?.name}"? This action cannot be undone.`}
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
