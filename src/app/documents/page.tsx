"use client";

import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import DeleteModal from "@/components/molecules/DeleteModal";
import Drawer from "@/components/molecules/Drawer";
import { Header } from "@/components/organisms/Header/Header";
import { useAuth } from "@/lib/auth-context";
import { DocumentForm } from "@/modules/Documents/DocumentForm";
import { PreDefinedDocumentsList } from "@/modules/Documents/PreDefinedDocumentsList";
import { Document, DocumentCategory, User } from "@/types/database";
import {
  Calendar,
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
  Upload,
  User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import DocumentIcon from "../../components/atoms/DocumentIcon";

type ViewMode = "grid" | "list";
type DocumentFilter = "all" | "predefined" | "userdefined";

export default function DocumentsPage() {
  const {
    user,
    loading: authLoading,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    fetchDocumentCategories,
    fetchAllUsers,
  } = useAuth();
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedOwner, setSelectedOwner] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filter, setFilter] = useState<DocumentFilter>("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPreDefinedType, setSelectedPreDefinedType] = useState<
    string | null
  >(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewStyle, setViewStyle] = useState<"grid" | "table">("grid");

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

      const [documentsData, categoriesData, usersData] = await Promise.all([
        fetchDocuments(),
        fetchDocumentCategories(),
        fetchAllUsers(),
      ]);

      if (documentsData.error) {
        setError(
          documentsData.error instanceof Error
            ? documentsData.error.message
            : "Failed to load documents"
        );
        return;
      }

      if (categoriesData.error) {
        setError(
          categoriesData.error instanceof Error
            ? categoriesData.error.message
            : "Failed to load categories"
        );
        return;
      }

      if (usersData.error) {
        setError(
          usersData.error instanceof Error
            ? usersData.error.message
            : "Failed to load users"
        );
        return;
      }

      setDocuments(documentsData.data || []);
      setCategories(categoriesData.data || []);
      setUsers(usersData.data || []);
    } catch (err) {
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [fetchDocuments, fetchDocumentCategories, fetchAllUsers]);

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    }
  }, [authLoading, user, loadData]);

  const handleCreateDocument = async (formData: any) => {
    try {
      setIsSubmitting(true);

      // Convert file to base64 for storage
      let content = "";
      let mimeType = "";

      if (formData.file) {
        const reader = new FileReader();
        content = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(formData.file);
        });
        mimeType = formData.file.type;
      }

      const documentData = {
        name: formData.name,
        category: formData.category,
        owner: formData.owner,
        validity: formData.validity || null,
        mimeType,
        content,
        isPreDefined: formData.isPreDefined,
        createdBy: user?.id || "",
        lastModifiedBy: user?.id || "",
      };

      const { data, error } = await createDocument(documentData);

      if (error) {
        setError(error instanceof Error ? error.message : "Operation failed");
        return;
      }

      if (data) {
        setDocuments((prev) => [data, ...prev]);
        setIsDrawerOpen(false);
        setEditingDocument(null);
        setSelectedPreDefinedType(null);
      }
    } catch (err) {
      setError("Failed to create document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDocument = async (formData: any) => {
    if (!editingDocument) return;

    try {
      setIsSubmitting(true);

      // Convert file to base64 for storage if new file is provided
      let content = editingDocument.content;
      let mimeType = editingDocument.mimeType;

      if (formData.file) {
        const reader = new FileReader();
        content = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(formData.file);
        });
        mimeType = formData.file.type;
      }

      const documentData = {
        name: formData.name,
        category: formData.category,
        owner: formData.owner,
        validity: formData.validity || null,
        mimeType,
        content,
        isPreDefined: formData.isPreDefined,
        lastModifiedBy: user?.id || "",
      };

      const { data, error } = await updateDocument(
        editingDocument.id,
        documentData
      );

      if (error) {
        setError(error instanceof Error ? error.message : "Operation failed");
        return;
      }

      if (data) {
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === editingDocument.id ? data : doc))
        );
        setIsDrawerOpen(false);
        setEditingDocument(null);
      }
    } catch (err) {
      setError("Failed to update document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      setIsSubmitting(true);
      const { error } = await deleteDocument(documentToDelete.id);

      if (error) {
        setError(error instanceof Error ? error.message : "Operation failed");
        return;
      }

      setDocuments((prev) =>
        prev.filter((doc) => doc.id !== documentToDelete.id)
      );
      setDeleteModalOpen(false);
      setDocumentToDelete(null);
    } catch (err) {
      setError("Failed to delete document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreDefinedUpload = (preDefinedType: string) => {
    setSelectedPreDefinedType(preDefinedType);
    setEditingDocument(null);

    // Create a hidden file input and trigger it
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
    fileInput.style.display = "none";

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Store the selected file temporarily
        setSelectedFile(file);
        setIsDrawerOpen(true);
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setSelectedPreDefinedType(null);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (document: Document) => {
    setDocumentToDelete(document);
    setDeleteModalOpen(true);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    const matchesOwner = selectedOwner === "all" || doc.owner === selectedOwner;
    const matchesFilter =
      filter === "all" ||
      (filter === "predefined" && doc.isPreDefined) ||
      (filter === "userdefined" && !doc.isPreDefined);

    return matchesSearch && matchesCategory && matchesOwner && matchesFilter;
  });

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  const ownerOptions = [
    { value: "all", label: "All Owners" },
    ...users.map((user) => ({
      value: user.id,
      label: user.name,
    })),
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="mt-2 text-gray-600">
            Manage your important documents and files
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={categoryOptions}
              />
              <Select
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
                options={ownerOptions}
              />
              <Button
                onClick={() => {
                  setEditingDocument(null);
                  setSelectedPreDefinedType(null);

                  // Create a hidden file input and trigger it
                  const fileInput = document.createElement("input");
                  fileInput.type = "file";
                  fileInput.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
                  fileInput.style.display = "none";

                  fileInput.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      setIsDrawerOpen(true);
                    }
                  };

                  document.body.appendChild(fileInput);
                  fileInput.click();
                  document.body.removeChild(fileInput);
                }}
                leftIcon={<Upload className="h-4 w-4" />}
              >
                Upload Document
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  variant={filter === "all" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "predefined" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFilter("predefined")}
                >
                  Pre-defined
                </Button>
                <Button
                  variant={filter === "userdefined" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFilter("userdefined")}
                >
                  User-defined
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Pre-defined Documents Section */}
        {filter === "all" || filter === "predefined" ? (
          <Card className="mb-6">
            <PreDefinedDocumentsList
              documents={documents}
              viewStyle={viewStyle}
              onViewStyleChange={setViewStyle}
              onPreDefinedUpload={handlePreDefinedUpload}
              onEditDocument={handleEditDocument}
              onDeleteDocument={handleDeleteClick}
            />
          </Card>
        ) : null}

        {/* User-defined Documents Section */}
        {filter === "all" || filter === "userdefined" ? (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                User-defined Documents
              </h2>
              <p className="text-gray-600 mb-6">
                Custom documents uploaded by users
              </p>

              {filteredDocuments.filter((doc) => !doc.isPreDefined).length ===
              0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No documents found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Upload your first document to get started
                  </p>
                  <Button
                    onClick={() => {
                      setEditingDocument(null);
                      setSelectedPreDefinedType(null);

                      // Create a hidden file input and trigger it
                      const fileInput = document.createElement("input");
                      fileInput.type = "file";
                      fileInput.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
                      fileInput.style.display = "none";

                      fileInput.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setIsDrawerOpen(true);
                        }
                      };

                      document.body.appendChild(fileInput);
                      fileInput.click();
                      document.body.removeChild(fileInput);
                    }}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Upload Document
                  </Button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "space-y-4"
                  }
                >
                  {filteredDocuments
                    .filter((doc) => !doc.isPreDefined)
                    .map((document) => (
                      <div
                        key={document.id}
                        className={`border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors ${
                          viewMode === "list"
                            ? "flex items-center justify-between"
                            : ""
                        }`}
                      >
                        <div
                          className={
                            viewMode === "list"
                              ? "flex items-center space-x-4"
                              : ""
                          }
                        >
                          <DocumentIcon
                            type="other"
                            size="md"
                            className="text-blue-600"
                          />
                          <div
                            className={viewMode === "list" ? "flex-1" : "mt-3"}
                          >
                            <h3 className="font-medium text-gray-900">
                              {document.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {categories.find(
                                (cat) => cat.id === document.category
                              )?.name || "Unknown Category"}
                            </p>
                            {viewMode === "list" && (
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <UserIcon className="h-3 w-3 mr-1" />
                                  {users.find((u) => u.id === document.owner)
                                    ?.name || "Unknown"}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(
                                    document.createdDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          className={`flex items-center space-x-2 ${
                            viewMode === "list" ? "" : "mt-3"
                          }`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              /* Handle view/download */
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDocument(document)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(document)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </Card>
        ) : null}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Document Form Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingDocument(null);
          setSelectedPreDefinedType(null);
        }}
        title={editingDocument ? "Edit Document" : "Upload Document"}
      >
        <DocumentForm
          onSubmit={
            editingDocument ? handleUpdateDocument : handleCreateDocument
          }
          onCancel={() => {
            setIsDrawerOpen(false);
            setEditingDocument(null);
            setSelectedPreDefinedType(null);
            setSelectedFile(null);
          }}
          document={editingDocument || undefined}
          categories={categories}
          users={users}
          isPreDefined={!!selectedPreDefinedType}
          preDefinedType={selectedPreDefinedType || undefined}
          isSubmitting={isSubmitting}
          preSelectedFile={selectedFile}
        />
      </Drawer>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDocumentToDelete(null);
        }}
        onConfirm={handleDeleteDocument}
        title="Delete Document"
        description={`Are you sure you want to delete "${documentToDelete?.name}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}
