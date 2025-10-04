"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import DeleteModal from "@/components/molecules/DeleteModal";
import Drawer from "@/components/molecules/Drawer";
import { Header } from "@/components/organisms/Header/Header";
import { ContactForm } from "@/modules/Contacts/ContactForm";
import { ContactDetails } from "@/modules/Contacts/ContactDetails";
import { useAuth } from "@/lib/auth-context";
import { Contact } from "@/types/database";
import {
  Plus,
  Search,
  Users,
  Grid3X3,
  List,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
} from "lucide-react";
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

  // Load contacts on component mount
  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

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
      data: Omit<Contact, "id" | "ownedBy" | "createdAt" | "updatedAt">
    ) => {
      try {
        setIsSubmitting(true);
        setError(null);

        let result;
        if (editingContact) {
          result = await updateContact(editingContact.id, data);
        } else {
          result = await createContact(data);
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
    [editingContact, createContact, updateContact]
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
  const filteredContacts = contacts
    .filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.primaryEmail
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.designation
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        contact.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical sorting

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: "work" | "personal") => {
    return category === "work" ? "blue" : "green";
  };

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
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600 mt-2">
              Manage your personal and professional contacts
            </p>
          </div>
          <Button
            onClick={handleAddContact}
            leftIcon={<Plus className="h-4 w-4" />}
            className="shrink-0"
          >
            Add Contact
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
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="pl-10"
            />
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
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Users className="h-4 w-4" />
            </button>
          </div>
        </div>

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
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "No contacts found" : "No contacts yet"}
              </h4>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first contact."}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleAddContact}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Contact
                </Button>
              )}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && filteredContacts.length > 0 && (
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleViewContact(contact)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {contact.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {contact.designation && (
                            <span>{contact.designation}</span>
                          )}
                          {contact.company && <span>at {contact.company}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          contact.category === "work"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {contact.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditContact(contact);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteContact(contact);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && filteredContacts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleViewContact(contact)}
                  className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl mx-auto mb-4">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {contact.name}
                    </h4>
                    {contact.designation && (
                      <p className="text-sm text-gray-500 mb-2">
                        {contact.designation}
                      </p>
                    )}
                    {contact.company && (
                      <p className="text-sm text-gray-500 mb-3">
                        {contact.company}
                      </p>
                    )}
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        contact.category === "work"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {contact.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && filteredContacts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Contacted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      onClick={() => handleViewContact(contact)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {contact.name}
                            </div>
                            {contact.designation && (
                              <div className="text-sm text-gray-500">
                                {contact.designation}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {contact.primaryEmail ||
                            contact.primaryPhone ||
                            "No contact info"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {contact.company || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            contact.category === "work"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {contact.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(contact.lastContacted)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditContact(contact);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteContact(contact);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
